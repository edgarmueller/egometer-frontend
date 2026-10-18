import { goalProgress, isDailyGoalReached } from "./goals";

const days = [...Array(7)].map((_, i) => new Date(2026, 9, 12 + i));
const meter = { type: "number", dailyGoal: 10, weeklyGoal: 3 };
const entries = [
  { date: "2026-10-12", value: 12 },
  { date: "2026-10-13", value: 5 },
  { date: "2026-10-14", value: 10 },
  // outside of the days
  { date: "2026-10-19", value: 20 },
];

describe("goals", () => {
  it("knows whether the daily goal is reached", () => {
    expect(isDailyGoalReached(meter, entries[0])).toBe(true);
    expect(isDailyGoalReached(meter, entries[1])).toBe(false);
    expect(isDailyGoalReached(meter, undefined)).toBe(false);
    expect(isDailyGoalReached({ type: "number" }, entries[0])).toBe(false);
  });

  it("counts the days that reach the daily goal within the days", () => {
    expect(goalProgress(meter, entries, days)).toEqual({
      reached: 2,
      target: 3,
    });
  });

  it("counts any entry if there is no daily goal", () => {
    expect(
      goalProgress({ type: "number", weeklyGoal: 3 }, entries, days)
    ).toEqual({ reached: 3, target: 3 });
  });

  it("scales the weekly goal to a month", () => {
    const month = [...Array(31)].map((_, i) => new Date(2026, 9, 1 + i));
    expect(goalProgress(meter, entries, month).target).toBe(13);
  });

  it("has no progress without a weekly goal", () => {
    expect(goalProgress({ type: "number" }, entries, days)).toBeUndefined();
    expect(goalProgress({ type: "mood", weeklyGoal: 3 }, [], days)).toBe(
      undefined
    );
  });
});
