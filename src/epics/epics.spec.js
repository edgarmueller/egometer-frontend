import * as _ from "lodash";
import { of } from "rxjs";
import "rxjs/add/operator/toArray";
import {
  fetchEntriesRequest,
  updateEntryRequest,
  UPDATE_ENTRY_SUCCESS,
  FETCH_ENTRIES_SUCCESS,
  FETCH_ENTRIES_FAILURE,
  UPDATE_ENTRY_FAILURE,
} from "../actions";
import { counterMeterId, counterEntries } from "../__mocks__/fixtures";
import { fetchEntriesEpic, updateEntryEpic } from ".";

describe("updateEntryEpic", () => {
  it("should update entry and fetch entries", (done) => {
    const deps = {
      api: {
        updateEntry: () => Promise.resolve(_.head(counterEntries)),
      },
    };
    const action$ = of(
      updateEntryRequest({
        meterId: counterMeterId,
        date: "2018-07-06",
        value: "whatever",
      })
    );
    const output$ = updateEntryEpic(action$, null, deps);
    output$.toArray().subscribe((actions) => {
      expect(actions[0].type).toBe(UPDATE_ENTRY_SUCCESS);
      done();
    });
  });

  it("should be capable of failing to update entry", (done) => {
    const deps = {
      api: {
        updateEntry: () => Promise.reject({ message: "expected failure" }),
      },
    };
    const action$ = of(
      updateEntryRequest({
        meterId: counterMeterId,
        date: "2018-07-06",
        value: "whatever",
      })
    );
    const output$ = updateEntryEpic(action$, null, deps);
    output$.toArray().subscribe((actions) => {
      expect(actions[0].type).toBe(UPDATE_ENTRY_FAILURE);
      expect(actions[0].error).toBe("expected failure");
      done();
    });
  });
});

describe("fetchEntriesEpic", () => {
  it("should fetch entries", (done) => {
    const deps = {
      api: {
        fetchEntries: () => {
          return Promise.resolve(counterEntries);
        },
      },
    };
    // passed date doesn't really matter
    const action$ = of(fetchEntriesRequest(2018, 6));
    const output$ = fetchEntriesEpic(action$, null, deps);
    output$.toArray().subscribe((actions) => {
      expect(actions[0].type).toBe(FETCH_ENTRIES_SUCCESS);
      done();
    });
  });

  it("should be capable to fail when fetching entries", (done) => {
    const deps = {
      api: {
        fetchEntries: () => {
          return Promise.reject({ message: "expected failure" });
        },
      },
    };
    // passed date doesn't really matter
    const action$ = of(fetchEntriesRequest(2018, 6));
    const output$ = fetchEntriesEpic(action$, null, deps);
    output$.toArray().subscribe((actions) => {
      expect(actions[0].type).toBe(FETCH_ENTRIES_FAILURE);
      expect(actions[0].error).toBe("expected failure");
      done();
    });
  });
});
