import { Subject, of } from "rxjs";
import { toArray } from "rxjs/operators";
import {
  deleteEntryRequest,
  fetchEntriesRequest,
  updateEntryRequest,
  updateMeterRequest,
  DELETE_ENTRY_SUCCESS,
  FETCH_ENTRIES_SUCCESS,
  FETCH_ENTRIES_FAILURE,
  UPDATE_ENTRY_FAILURE,
  UPDATE_ENTRY_SUCCESS,
  UPDATE_METER_SUCCESS,
} from "../actions";
import { counterMeterId, counterEntries } from "../__mocks__/fixtures";
import { fetchEntriesEpic, updateMeterDebounceEpic, writeEntryEpic } from ".";

const entry = (overrides) => ({
  meterId: counterMeterId,
  date: "2018-07-06",
  value: 1,
  ...overrides,
});

// runs an epic on actions that are pushed later on
const runEpic = (epic, deps) => {
  const action$ = new Subject();
  const output = [];
  epic(action$, null, deps).subscribe((action) => output.push(action));
  return { action$, output };
};

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("writeEntryEpic", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should save entries", async () => {
    const saved = entry({ id: "e1" });
    const deps = {
      api: { updateEntry: () => Promise.resolve({ data: saved }) },
    };
    const actions = await writeEntryEpic(
      of(updateEntryRequest(entry())),
      null,
      deps
    )
      .pipe(toArray())
      .toPromise();
    expect(actions).toEqual([{ type: UPDATE_ENTRY_SUCCESS, entry: saved }]);
  });

  it("should report failures to save an entry", async () => {
    const deps = {
      api: {
        updateEntry: () => Promise.reject({ message: "expected failure" }),
      },
    };
    const actions = await writeEntryEpic(
      of(updateEntryRequest(entry())),
      null,
      deps
    )
      .pipe(toArray())
      .toPromise();
    expect(actions[0].type).toBe(UPDATE_ENTRY_FAILURE);
    expect(actions[0].error).toBe("expected failure");
  });

  it("should save entries of different meters independently", async () => {
    const updateEntry = vi.fn((e) => Promise.resolve({ data: e }));
    const { action$, output } = runEpic(writeEntryEpic, {
      api: { updateEntry },
    });
    action$.next(updateEntryRequest(entry({ meterId: "a" })));
    action$.next(updateEntryRequest(entry({ meterId: "b" })));
    await flushPromises();
    expect(output.map((a) => a.entry.meterId)).toEqual(["a", "b"]);
  });

  it("should only save the latest of debounced changes", async () => {
    vi.useFakeTimers();
    const updateEntry = vi.fn((e) => Promise.resolve({ data: e }));
    const { action$ } = runEpic(writeEntryEpic, { api: { updateEntry } });
    action$.next(updateEntryRequest(entry({ value: "a" }), true));
    vi.advanceTimersByTime(200);
    action$.next(updateEntryRequest(entry({ value: "ab" }), true));
    vi.advanceTimersByTime(500);
    expect(updateEntry).toHaveBeenCalledTimes(1);
    expect(updateEntry).toHaveBeenCalledWith(entry({ value: "ab" }));
  });

  it("should cancel pending changes when an unsaved entry is cleared", () => {
    vi.useFakeTimers();
    const updateEntry = vi.fn();
    const deleteEntry = vi.fn();
    const { action$ } = runEpic(writeEntryEpic, {
      api: { updateEntry, deleteEntry },
    });
    action$.next(updateEntryRequest(entry({ value: "a" }), true));
    action$.next(deleteEntryRequest(counterMeterId, entry(), true));
    vi.advanceTimersByTime(1000);
    expect(updateEntry).not.toHaveBeenCalled();
    expect(deleteEntry).not.toHaveBeenCalled();
  });

  it("should delete saved entries", async () => {
    const saved = entry({ id: "e1" });
    const deps = {
      api: { deleteEntry: (e) => Promise.resolve({ data: e }) },
    };
    const actions = await writeEntryEpic(
      of(deleteEntryRequest(counterMeterId, saved)),
      null,
      deps
    )
      .pipe(toArray())
      .toPromise();
    expect(actions).toEqual([
      {
        type: DELETE_ENTRY_SUCCESS,
        meterId: counterMeterId,
        entry: { id: "e1", date: "2018-07-06", value: 1 },
      },
    ]);
  });
});

describe("updateMeterDebounceEpic", () => {
  it("should save the latest changes of each meter", () => {
    vi.useFakeTimers();
    const updateMeter = vi.fn(() => new Promise(() => {}));
    const { action$ } = runEpic(updateMeterDebounceEpic, {
      api: { updateMeter },
    });
    action$.next(updateMeterRequest({ id: "a", name: "M" }));
    action$.next(updateMeterRequest({ id: "b", name: "N" }));
    action$.next(updateMeterRequest({ id: "a", name: "Mood" }));
    vi.advanceTimersByTime(500);
    expect(updateMeter.mock.calls.map(([meter]) => meter)).toEqual([
      { id: "b", name: "N" },
      { id: "a", name: "Mood" },
    ]);
    vi.useRealTimers();
  });

  it("should report saved meters", async () => {
    const meter = { id: "a", name: "Mood" };
    const deps = {
      api: { updateMeter: () => Promise.resolve({ data: meter }) },
    };
    const actions = await updateMeterDebounceEpic(
      of(updateMeterRequest(meter)),
      null,
      deps
    )
      .pipe(toArray())
      .toPromise();
    expect(actions).toEqual([{ type: UPDATE_METER_SUCCESS, meter }]);
  });
});

describe("fetchEntriesEpic", () => {
  it("should fetch entries", async () => {
    const deps = {
      api: {
        fetchEntries: () => Promise.resolve({ data: counterEntries }),
      },
    };
    const actions = await fetchEntriesEpic(
      of(fetchEntriesRequest(2018, 6)),
      null,
      deps
    )
      .pipe(toArray())
      .toPromise();
    expect(actions).toEqual([
      { type: FETCH_ENTRIES_SUCCESS, entries: counterEntries },
    ]);
  });

  it("should keep fetching entries after a failure", async () => {
    const fetchEntries = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.reject({ message: "expected failure" })
      )
      .mockReturnValueOnce(Promise.resolve({ data: counterEntries }));
    const { action$, output } = runEpic(fetchEntriesEpic, {
      api: { fetchEntries },
    });
    action$.next(fetchEntriesRequest(2018, 6));
    await new Promise((resolve) => setTimeout(resolve, 300));
    action$.next(fetchEntriesRequest(2018, 7));
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(output.map((a) => a.type)).toEqual([
      FETCH_ENTRIES_FAILURE,
      FETCH_ENTRIES_SUCCESS,
    ]);
  });
});
