import {
  getEntriesByMeter,
  getMeterError,
  getEntriesError,
  isMetersLoading,
  findMeterById,
} from ".";

describe("Reducer getters", () => {
  it("should return entries by meter", () => {
    expect(
      getEntriesByMeter({
        entries: {
          entries: { foo: "bar" },
        },
      })
    ).toEqual({ foo: "bar" });
  });

  it("should find a meter by an id", () => {
    expect(
      findMeterById("foo")({
        meters: {
          meters: [
            {
              id: "foo",
              meter: "test",
            },
          ],
        },
      })
    ).toEqual({
      id: "foo",
      meter: "test",
    });
  });

  it("should return loading status of meters", () => {
    expect(
      isMetersLoading({
        meters: {
          isLoading: true,
        },
      })
    ).toBe(true);
  });

  it("should return meter errors", () => {
    expect(
      getMeterError({
        meters: {
          error: "Unknown error",
        },
      })
    ).toEqual("Unknown error");
  });

  it("should return entries errors", () => {
    expect(
      getEntriesError({
        entries: {
          error: "Unknown error",
        },
      })
    ).toEqual("Unknown error");
  });
});
