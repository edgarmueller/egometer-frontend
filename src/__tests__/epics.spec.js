import * as _ from 'lodash';
import 'rxjs/add/operator/toArray';
import { ActionsObservable } from "redux-observable";
import {
  fetchEntriesPerMonthRequest,
  updateEntryRequest,
  UPDATE_ENTRY_SUCCESS,
  FETCH_ENTRIES_REQUEST,
  FETCH_ENTRIES_SUCCESS,
  FETCH_ENTRIES_FAILURE,
  UPDATE_ENTRY_FAILURE,
  USER_LOGIN_SUCCESS,
  FETCH_SCHEMAS_REQUEST,
  FETCH_METERS_REQUEST
} from "../actions";
import { counterMeterId, counterEntries, counterSchema, counterMeter } from "../__mocks__/testData";
import mockStorage from "../__mocks__/mockStorage";
import { fetchEntriesEpic, updateEntryEpic, fetchAllAfterLogin } from "../epics";

global.localStorage = mockStorage();

describe("updateEntryEpic", () => {
  it("should update entry and fetch entries", (done) => {
    const deps = {
      api: {
        updateEntry: () => Promise.resolve(_.head(counterEntries))
      }
    };
    const action$ = ActionsObservable.of(
      updateEntryRequest({
        meterId: counterMeterId,
        date: "2018-07-06",
        value: "whatever"
      }));
    const output$ = updateEntryEpic(action$, null, deps);
    output$.toArray().subscribe(actions => {
      expect(actions[0].type).toBe(UPDATE_ENTRY_SUCCESS);
      done();
    });
  });

  it("should be capable of failing to update entry", (done) => {
    const deps = {
      api: {
        updateEntry: () => Promise.reject({message: 'expected failure'})
      }
    };
    const action$ = ActionsObservable.of(
      updateEntryRequest({
        meterId: counterMeterId,
        date: "2018-07-06",
        value: "whatever"
      }));
    const output$ = updateEntryEpic(action$, null, deps);
    output$.toArray().subscribe(actions => {
      expect(actions[0].type).toBe(UPDATE_ENTRY_FAILURE);
      expect(actions[0].error).toBe('expected failure');
      done();
    });
  });
});

describe("fetchEntriesEpic", () => {

  it("should fetch entries", (done) => {
    const deps = {
      api: {
        fetchEntriesPerMonth: () => {
          return Promise.resolve(counterEntries)
        }
      }
    };
    // passed date doesn't really matter
    const action$ = ActionsObservable.of(fetchEntriesPerMonthRequest("2018-07-06"));
    const output$ = fetchEntriesEpic(action$, null, deps);
    output$.toArray().subscribe(actions => {
      expect(actions[0].type).toBe(FETCH_ENTRIES_SUCCESS);
      done();
    });
  });

  it("should be capable to fail when fetching entries", (done) => {
    const deps = {
      api: {
        fetchEntriesPerMonth: () => {
          return Promise.reject({ message: 'expected failure' })
        }
      }
    };
    // passed date doesn't really matter
    const action$ = ActionsObservable.of(fetchEntriesPerMonthRequest("2018-07-06"));
    const output$ = fetchEntriesEpic(action$, null, deps);
    output$.toArray().subscribe(actions => {
      expect(actions[0].type).toBe(FETCH_ENTRIES_FAILURE);
      expect(actions[0].error).toBe('expected failure');
      done();
    });
  });
});

describe("fetchAllAfterLogin", () => {
  it('should trigger fetching of schema, meters & entries after login', (done) => {
    const deps = {
      api: {
        fetchEntriesPerMonth: () => Promise.resolve(counterEntries),
        fetchSchemas: () => Promise.resolve({ data: [counterSchema] }),
        fetchMeters: () => Promise.resolve({ data: [counterMeter] })
      }
    };
    const action$ = ActionsObservable.of(
      { type: USER_LOGIN_SUCCESS }
    );
    const output$ = fetchAllAfterLogin(action$, null, deps);
    output$.toArray().subscribe(actions => {
      expect(actions[0].type).toBe(FETCH_SCHEMAS_REQUEST);
      expect(actions[1].type).toBe(FETCH_METERS_REQUEST);
      expect(actions[2].type).toBe(FETCH_ENTRIES_REQUEST);
      done();
    });
  });
});
