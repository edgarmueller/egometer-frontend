import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/of";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/map";
import { combineEpics } from "redux-observable";
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
  USER_LOGIN_SUCCESS,
  FETCH_SCHEMAS_REQUEST,
  FETCH_METERS_REQUEST,
  UPDATE_METER_REQUEST,
  UPDATE_METER_SUCCESS,
  UPDATE_METER_FAILURE
} from "../actions";

export function fetchSchemasEpic(action$, store, deps) {
  return action$
    .ofType(FETCH_SCHEMAS_REQUEST)
    .flatMap(() =>
      Observable.fromPromise(
        deps.api
          .fetchSchemas()
          .then(resp => setSchemas(resp.data), err => setSchemasError(err))
      )
    );
}

export function fetchMetersEpic(action$, store, deps) {
  return action$
    .ofType(FETCH_METERS_REQUEST)
    .flatMap(() =>
      Observable.fromPromise(
        deps.api
          .fetchMeters()
          .then(resp => setMeters(resp.data), err => setMetersError(err))
      )
    );
}

export function fetchAllAfterLogin(action$, store, deps) {
  return action$.ofType(USER_LOGIN_SUCCESS).flatMap(() => [
    // fetch everything initially
    { type: FETCH_SCHEMAS_REQUEST },
    { type: FETCH_METERS_REQUEST }
  ]);
}

export function fetchEntriesEpic(action$, store, deps) {
  return action$
    .ofType(FETCH_ENTRIES_REQUEST)
    .debounceTime(250)
    .switchMap(({ date, meterId, days }) => {
      return Observable.fromPromise(
        deps.api.fetchEntriesByDate(date, meterId, days)
      );
    })
    .map(resp => receiveEntries(resp.data))
    .catch(error => {
      return Observable.of({
        type: FETCH_ENTRIES_FAILURE,
        error: error.message
      });
    });
}

export function updateEntryEpic(action$, store, deps) {
  return action$
    .ofType(UPDATE_ENTRY_REQUEST)
    .filter(({ shouldDebounce }) => !shouldDebounce)
    .switchMap(({ entry }) => {
      return Observable.fromPromise(deps.api.updateEntry(entry))
        .flatMap(resp => {
          return Observable.of({
            type: UPDATE_ENTRY_SUCCESS,
            entry: resp.data
          });
        })
        .catch(error => {
          return Observable.of({
            type: UPDATE_ENTRY_FAILURE,
            meterId: entry.meterId,
            error: error.message
          });
        });
    });
}

export function updateEntryDebounceEpic(action$, store, deps) {
  return action$
    .ofType(UPDATE_ENTRY_REQUEST)
    .filter(({ shouldDebounce }) => shouldDebounce)
    .debounceTime(500)
    .switchMap(({ entry }) => {
      return Observable.fromPromise(deps.api.updateEntry(entry))
        .flatMap(resp => {
          return Observable.of({
            type: UPDATE_ENTRY_SUCCESS,
            entry: resp.data
          });
        })
        .catch(error => {
          return Observable.of({
            type: UPDATE_ENTRY_FAILURE,
            meterId: entry.meterId,
            error: error.message
          });
        });
    });
}

export function updateMeterDebounceEpic(action$, store, deps) {
  return action$
    .ofType(UPDATE_METER_REQUEST)
    .debounceTime(500)
    .switchMap(({ meter }) => {
      return Observable.fromPromise(deps.api.updateMeter(meter))
        .flatMap(resp => {
          return Observable.of({
            type: UPDATE_METER_SUCCESS,
            meter: resp.data
          });
        })
        .catch(error => {
          return Observable.of({
            type: UPDATE_METER_FAILURE,
            meterId: meter.id,
            error: error.message
          });
        });
    });
}

export const rootEpic = combineEpics(
  fetchSchemasEpic,
  fetchMetersEpic,
  fetchEntriesEpic,
  updateEntryEpic,
  updateEntryDebounceEpic,
  updateMeterDebounceEpic,
  fetchAllAfterLogin
);
