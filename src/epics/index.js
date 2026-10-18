import { EMPTY, from, of, timer } from "rxjs";
import {
  map,
  catchError,
  groupBy,
  mergeMap,
  switchMap,
  debounceTime,
} from "rxjs/operators";
import { combineEpics, ofType } from "redux-observable";
import {
  receiveEntries,
  setMetersError,
  setMeters,
  FETCH_ENTRIES_FAILURE,
  FETCH_ENTRIES_REQUEST,
  UPDATE_ENTRY_FAILURE,
  UPDATE_ENTRY_REQUEST,
  UPDATE_ENTRY_SUCCESS,
  FETCH_METERS_REQUEST,
  UPDATE_METER_REQUEST,
  UPDATE_METER_SUCCESS,
  UPDATE_METER_FAILURE,
  DELETE_ENTRY_REQUEST,
  DELETE_ENTRY_FAILURE,
  DELETE_ENTRY_SUCCESS,
} from "../actions";

export function fetchMetersEpic(action$, _store, deps) {
  return action$.pipe(
    ofType(FETCH_METERS_REQUEST),
    mergeMap(() =>
      from(
        deps.api.fetchMeters().then(
          (resp) => setMeters(resp.data),
          (err) => setMetersError(err)
        )
      )
    )
  );
}

export function fetchEntriesEpic(action$, store, deps) {
  const { fetchEntries, fetchEntriesByWeek } = deps.api;
  return action$.pipe(
    ofType(FETCH_ENTRIES_REQUEST),
    debounceTime(250),
    switchMap(({ year, month, week, meterId }) =>
      from(
        week
          ? fetchEntriesByWeek(year, week)
          : fetchEntries(year, month, meterId)
      ).pipe(
        map((resp) => receiveEntries(resp.data)),
        // within the switchMap, so that later requests are still handled
        catchError((error) =>
          of({
            type: FETCH_ENTRIES_FAILURE,
            error: error.message,
          })
        )
      )
    )
  );
}

// how long to wait for more changes before saving a debounced change
const DEBOUNCE_MS = 500;

const saveEntry = ({ entry }, api) =>
  from(api.updateEntry(entry)).pipe(
    map((resp) => ({
      type: UPDATE_ENTRY_SUCCESS,
      entry: resp.data,
    })),
    catchError((error) =>
      of({
        type: UPDATE_ENTRY_FAILURE,
        meterId: entry.meterId,
        error: error.message,
      })
    )
  );

const removeEntry = ({ entry }, api) =>
  // an entry that was never saved only cancels pending changes
  entry.id === undefined
    ? EMPTY
    : from(api.deleteEntry(entry)).pipe(
        map(({ data }) => {
          const { meterId, ...other } = data;
          return {
            type: DELETE_ENTRY_SUCCESS,
            meterId,
            entry: other,
          };
        }),
        catchError((error) =>
          of({
            type: DELETE_ENTRY_FAILURE,
            entry: entry.id,
            error: error.message,
          })
        )
      );

/**
 * Saves and deletes entries. Changes of the same entry replace each other,
 * so the latest one wins, while changes of different entries don't affect
 * each other. Debounced changes wait for further changes first.
 */
export function writeEntryEpic(action$, store, deps) {
  return action$.pipe(
    ofType(UPDATE_ENTRY_REQUEST, DELETE_ENTRY_REQUEST),
    groupBy(({ entry }) => `${entry.meterId}|${entry.date}`),
    mergeMap((changes$) =>
      changes$.pipe(
        switchMap((action) =>
          timer(action.shouldDebounce ? DEBOUNCE_MS : 0).pipe(
            mergeMap(() =>
              action.type === UPDATE_ENTRY_REQUEST
                ? saveEntry(action, deps.api)
                : removeEntry(action, deps.api)
            )
          )
        )
      )
    )
  );
}

const saveMeter = (api) => ({ meter }) =>
  from(api.updateMeter(meter)).pipe(
    map((resp) => ({
      type: UPDATE_METER_SUCCESS,
      meter: resp.data,
    })),
    catchError((error) =>
      of({
        type: UPDATE_METER_FAILURE,
        meterId: meter.id,
        error: error.message,
      })
    )
  );

/** Saves changes of meters once no more changes of a meter follow. */
export function updateMeterDebounceEpic(action$, store, deps) {
  return action$.pipe(
    ofType(UPDATE_METER_REQUEST),
    groupBy(({ meter }) => meter.id),
    mergeMap((updates$) =>
      updates$.pipe(debounceTime(DEBOUNCE_MS), switchMap(saveMeter(deps.api)))
    )
  );
}

export const rootEpic = combineEpics(
  fetchMetersEpic,
  fetchEntriesEpic,
  writeEntryEpic,
  updateMeterDebounceEpic
);
