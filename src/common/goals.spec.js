import moment from "moment";
import {
  goalHistory,
  goalProgress,
  goalTarget,
  isDailyGoalReached,
  meetsMeter,
  meterGoals,
} from "./goals";

// Monday to Sunday
const days = [...Array(7)].map((_, i) => new Date(2026, 9, 12 + i));
const numberMeter = { type: "number", dailyGoal: 10, weeklyGoal: 3 };
const entries = [
  { date: "2026-10-12", value: 12 },
  { date: "2026-10-13", value: 5 },
  { date: "2026-10-14", value: 10 },
  // outside of the days
  { date: "2026-10-19", value: 20 },
];

describe("goals", () => {
  it("knows whether the daily goal is reached", () => {
    expect(isDailyGoalReached(numberMeter, entries[0])).toBe(true);
    expect(isDailyGoalReached(numberMeter, entries[1])).toBe(false);
    expect(isDailyGoalReached(numberMeter, undefined)).toBe(false);
    expect(isDailyGoalReached({ type: "number" }, entries[0])).toBe(false);
  });

  it("knows which values meet a meter", () => {
    expect(meetsMeter(numberMeter, 10)).toBe(true);
    expect(meetsMeter(numberMeter, 9)).toBe(false);
    expect(meetsMeter({ type: "number" }, 1)).toBe(true);
    expect(meetsMeter({ type: "boolean" }, true)).toBe(true);
    expect(meetsMeter({ type: "boolean" }, false)).toBe(false);
    expect(meetsMeter({ type: "quantity" }, "a_bit")).toBe(true);
    expect(meetsMeter({ type: "quantity" }, "none")).toBe(false);
    expect(meetsMeter({ type: "mood" }, "awful")).toBe(true);
    expect(meetsMeter({ type: "text" }, "")).toBe(false);
  });

  it("has a weekly goal or goals per tag", () => {
    expect(meterGoals({ type: "mood" })).toEqual([]);
    expect(meterGoals({ type: "boolean", weeklyGoal: 4 })).toMatchObject([
      { key: "weekly", label: undefined, timesPerWeek: 4 },
    ]);
    const [sports] = meterGoals({
      type: "activities",
      weeklyGoal: 7,
      activityGoals: [{ activity: "sports", timesPerWeek: 2 }],
    });
    expect(sports).toMatchObject({ key: "sports", label: "Sports" });
    expect(sports.isMet(["work", "sports"])).toBe(true);
    expect(sports.isMet(["work"])).toBe(false);
  });

  it("counts the days that meet each goal within the days", () => {
    expect(goalProgress(numberMeter, entries, days)).toEqual([
      {
        key: "weekly",
        label: undefined,
        timesPerWeek: 3,
        reached: 2,
        target: 3,
      },
    ]);
    const activities = {
      type: "activities",
      activityGoals: [
        { activity: "sports", timesPerWeek: 2 },
        { activity: "music", timesPerWeek: 1 },
      ],
    };
    const tagged = [
      { date: "2026-10-12", value: ["sports", "work"] },
      { date: "2026-10-15", value: ["sports"] },
    ];
    expect(
      goalProgress(activities, tagged, days).map(({ label, reached }) => [
        label,
        reached,
      ])
    ).toEqual([
      ["Sports", 2],
      ["Music", 0],
    ]);
  });

  it("scales targets to the number of days", () => {
    expect(goalTarget(3, 7)).toBe(3);
    expect(goalTarget(3, 31)).toBe(13);
    expect(goalTarget(7, 31)).toBe(31);
    expect(goalTarget(1, 2)).toBe(1);
  });

  describe("goalHistory", () => {
    const goal = { timesPerWeek: 2, isMet: (value) => value === true };
    const yes = (...dates) => dates.map((date) => ({ date, value: true }));
    // a Wednesday
    const today = moment("2026-10-14");

    it("counts the weeks that met the goal and the streak", () => {
      const history = goalHistory(
        goal,
        yes(
          // week of Sep 21: met
          "2026-09-21",
          "2026-09-23",
          // week of Sep 28: not met
          "2026-09-29",
          // weeks of Oct 5: met, and this week once so far
          "2026-10-05",
          "2026-10-06",
          "2026-10-13"
        ),
        moment("2026-09-21"),
        today
      );
      expect(history).toEqual({
        weeksMet: 2,
        weeks: 3,
        streak: 1,
        thisWeek: 1,
      });
    });

    it("extends the streak once the current week meets the goal", () => {
      const history = goalHistory(
        goal,
        yes("2026-10-05", "2026-10-06", "2026-10-12", "2026-10-13"),
        moment("2026-10-05"),
        today
      );
      expect(history).toMatchObject({ weeksMet: 1, streak: 2, thisWeek: 2 });
    });
  });
});
