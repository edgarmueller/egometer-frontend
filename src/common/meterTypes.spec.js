import {
  activityLabel,
  formatValue,
  isEmptyValue,
  typeLabel,
} from "./meterTypes";

describe("meter types", () => {
  it("labels built-in tags nicely and shows custom ones as typed", () => {
    expect(activityLabel("movies_tv")).toBe("Movies & TV");
    expect(activityLabel("side_project")).toBe("Side Project");
    expect(activityLabel("Yoga & stretching")).toBe("Yoga & stretching");
  });

  it("formats the values of entries", () => {
    expect(formatValue({ type: "mood" }, "great")).toBe("Great");
    expect(formatValue({ type: "quantity" }, "a_bit")).toBe("A bit");
    expect(formatValue({ type: "boolean" }, true)).toBe("Yes");
    expect(formatValue({ type: "number" }, 3.5)).toBe("3.5");
    expect(formatValue({ type: "activities" }, ["work", "movies_tv"])).toBe(
      "Work, Movies & TV"
    );
    expect(formatValue({ type: "text" }, undefined)).toBe("");
  });

  it("omits the type of meters named after it", () => {
    expect(typeLabel({ type: "mood", name: "Mood" })).toBeUndefined();
    expect(typeLabel({ type: "number", name: "Steps" })).toBe("Number");
  });

  it("knows values that don't track anything", () => {
    [undefined, null, false, "", []].forEach((value) =>
      expect(isEmptyValue(value)).toBe(true)
    );
    [0, true, "x", ["work"]].forEach((value) =>
      expect(isEmptyValue(value)).toBe(false)
    );
  });
});
