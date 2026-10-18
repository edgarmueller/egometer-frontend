import { entryIntensity, intensityScale } from "./intensity";

describe("intensity", () => {
  it("grows with the mood and quantity", () => {
    expect(entryIntensity({ type: "mood" }, "awful")).toBe(0.2);
    expect(entryIntensity({ type: "mood" }, "great")).toBe(1);
    expect(entryIntensity({ type: "quantity" }, "a_bit")).toBeCloseTo(2 / 3);
  });

  it("is relative to the largest number or number of activities", () => {
    const meter = { type: "number", dailyGoal: 10 };
    const scale = intensityScale(meter, [{ value: 5 }, { value: 20 }]);
    expect(scale).toBe(20);
    expect(entryIntensity(meter, 5, scale)).toBe(0.25);
    // at least the daily goal
    expect(intensityScale(meter, [{ value: 5 }])).toBe(10);
    const activities = { type: "activities" };
    const tags = [{ value: ["a"] }, { value: ["a", "b", "c", "d"] }];
    expect(
      entryIntensity(activities, ["a", "b"], intensityScale(activities, tags))
    ).toBe(0.5);
  });

  it("is full for yes, half for notes and none without a value", () => {
    expect(entryIntensity({ type: "boolean" }, true)).toBe(1);
    expect(entryIntensity({ type: "boolean" }, false)).toBe(0);
    expect(entryIntensity({ type: "text" }, "note")).toBe(0.5);
    expect(entryIntensity({ type: "mood" }, undefined)).toBe(0);
  });
});
