import { from, of } from "rxjs";
import {
  map,
  catchError,
  filter,
  mergeMap,
  switchMap,
  debounceTime,
} from "rxjs/operators";
import { combineEpics, ofType } from "redux-observable";
import {
  receiveEntries,
  setSchemas,
  setSchemasError,
  setMetersError,
  setMeters,
  FETCH_ENTRIES_FAILURE,
  FETCH_ENTRIES_REQUEST,
  UPDATE_ENTRY_FAILURE,
  UPDATE_ENTRY_REQUEST,
  UPDATE_ENTRY_SUCCESS,
  FETCH_SCHEMAS_REQUEST,
  FETCH_METERS_REQUEST,
  UPDATE_METER_REQUEST,
  UPDATE_METER_SUCCESS,
  UPDATE_METER_FAILURE,
  DELETE_ENTRY_REQUEST,
  DELETE_ENTRY_FAILURE,
  DELETE_ENTRY_SUCCESS,
} from "../actions";

export function fetchSchemasEpic(action$, store, deps) {
  return action$.pipe(
    ofType(FETCH_SCHEMAS_REQUEST),
    mergeMap(() =>
      from(
        deps.api.fetchSchemas().then(
          (resp) => setSchemas(resp.data),
          (err) => setSchemasError(err)
        )
      )
    )
  );
}

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
    switchMap(({ year, month, week, meterId }) => {
      if (week) {
        return from(fetchEntriesByWeek(year, week));
      } else {
        return from(fetchEntries(year, month, meterId));
      }
    }),
    map((resp) => receiveEntries(resp.data)),
    catchError((error) => {
      return of({
        type: FETCH_ENTRIES_FAILURE,
        error: error.message,
      });
    })
  );
}

export function updateEntryEpic(action$, store, deps) {
  return action$.pipe(
    ofType(UPDATE_ENTRY_REQUEST),
    filter(({ shouldDebounce }) => !shouldDebounce),
    switchMap(({ entry }) => {
      return from(deps.api.updateEntry(entry)).pipe(
        mergeMap((resp) => {
          return of({
            type: UPDATE_ENTRY_SUCCESS,
            entry: resp.data,
          });
        }),
        catchError((error) => {
          return of({
            type: UPDATE_ENTRY_FAILURE,
            meterId: entry.meterId,
            error: error.message,
          });
        })
      );
    })
  );
}

export function deleteEntryEpic(action$, store, deps) {
  return action$.pipe(
    ofType(DELETE_ENTRY_REQUEST),
    //    .filter(({ shouldDebounce }) => !shouldDebounce)
    switchMap(({ entry }) => {
      return from(deps.api.deleteEntry(entry)).pipe(
        mergeMap(({ data }) => {
          const { meterId, ...other } = data;
          return of({
            type: DELETE_ENTRY_SUCCESS,
            meterId: meterId,
            entry: other,
          });
        }),
        catchError((error) => {
          return of({
            type: DELETE_ENTRY_FAILURE,
            entry: entry.id,
            error: error.message,
          });
        })
      );
    })
  );
}

export function updateEntryDebounceEpic(action$, store, deps) {
  return action$.pipe(
    ofType(UPDATE_ENTRY_REQUEST),
    filter(({ shouldDebounce }) => shouldDebounce),
    debounceTime(500),
    switchMap(({ entry }) => {
      return from(deps.api.updateEntry(entry))
        .flatMap((resp) => {
          return of({
            type: UPDATE_ENTRY_SUCCESS,
            entry: resp.data,
          });
        })
        .catch((error) => {
          return of({
            type: UPDATE_ENTRY_FAILURE,
            meterId: entry.meterId,
            error: error.message,
          });
        });
    })
  );
}

export function updateMeterDebounceEpic(action$, store, deps) {
  return action$.pipe(
    ofType(UPDATE_METER_REQUEST),
    debounceTime(500),
    switchMap(({ meter }) => {
      return from(deps.api.updateMeter(meter))
        .flatMap((resp) => {
          return of({
            type: UPDATE_METER_SUCCESS,
            meter: resp.data,
          });
        })
        .catch((error) => {
          return of({
            type: UPDATE_METER_FAILURE,
            meterId: meter.id,
            error: error.message,
          });
        });
    })
  );
}

export const rootEpic = combineEpics(
  fetchSchemasEpic,
  fetchMetersEpic,
  fetchEntriesEpic,
  updateEntryEpic,
  deleteEntryEpic,
  updateEntryDebounceEpic,
  updateMeterDebounceEpic
);
