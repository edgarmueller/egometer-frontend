import moment from "moment";
import {
  factorsOf,
  moodByDate,
  moodByFactor,
  moodByWeekday,
  moodScore,
  streaks,
} from "./insights";

const day = (n) => moment("2026-10-01").add(n, "days").format("YYYY-MM-DD");

describe("insights", () => {
  it("scores moods from 1 to 5", () => {
    expect(moodScore("awful")).toBe(1);
    expect(moodScore("great")).toBe(5);
    expect(moodScore("unknown")).toBeUndefined();
  });

  describe("moodByFactor", () => {
    const mood = { id: "m", type: "mood" };
    const activities = {
      id: "a",
      name: "Activities",
      type: "activities",
      options: ["sports", "work", "music"],
    };
    const workout = { id: "b", name: "Workout", type: "boolean" };
    // great days with sports, okay days without
    const moods = moodByDate(
      [...Array(8)].map((_, i) => ({
        date: day(i),
        value: i < 4 ? "great" : "okay",
      }))
    );
    const entriesByMeter = {
      a: [
        ...[0, 1, 2, 3].map((i) => ({ date: day(i), value: ["sports"] })),
        ...[4, 5, 6].map((i) => ({ date: day(i), value: ["work"] })),
        // day 7 has no activities, so it says nothing about them
      ],
      b: [0, 1, 4, 5].map((i) => ({ date: day(i), value: true })),
    };
    const factors = moodByFactor(
      moods,
      factorsOf([mood, activities, workout], entriesByMeter)
    );

    it("compares the mood on days with and without each factor", () => {
      const sports = factors.find((f) => f.label === "Sports");
      expect(sports).toMatchObject({ days: 4, withMood: 5, withoutMood: 3 });
      expect(sports.difference).toBe(2);
      const work = factors.find((f) => f.label === "Work");
      // compared to the days with other activities only
      expect(work).toMatchObject({ days: 3, withMood: 3, withoutMood: 5 });
    });

    it("counts days without an entry of a yes/no meter as no", () => {
      const workoutResult = factors.find((f) => f.label === "Workout");
      expect(workoutResult).toMatchObject({
        days: 4,
        withMood: 4,
        withoutMood: 4,
      });
    });

    it("sorts the factors from best to worst", () => {
      expect(factors.map((f) => f.label)).toEqual([
        "Sports",
        "Workout",
        "Work",
      ]);
    });

    it("leaves out factors without enough days", () => {
      // music was never tagged
      expect(factors.find((f) => f.label === "Music")).toBeUndefined();
    });
  });

  it("averages the mood per weekday", () => {
    // 2026-10-05 is a Monday
    const moods = moodByDate([
      { date: "2026-10-05", value: "great" },
      { date: "2026-10-12", value: "okay" },
      { date: "2026-10-11", value: "bad" },
    ]);
    const byWeekday = moodByWeekday(moods);
    expect(byWeekday[0]).toEqual({ mood: 4, days: 2 });
    expect(byWeekday[6]).toEqual({ mood: 2, days: 1 });
    expect(byWeekday[1]).toEqual({ mood: undefined, days: 0 });
  });

  describe("streaks", () => {
    const today = moment(day(10));

    it("finds the current and the longest streak", () => {
      const dates = [0, 1, 2, 3, 6, 8, 9, 10].map(day);
      expect(streaks(dates, today)).toEqual({ current: 3, longest: 4 });
    });

    it("keeps the current streak while today isn't tracked yet", () => {
      expect(streaks([day(8), day(9)], today)).toEqual({
        current: 2,
        longest: 2,
      });
    });

    it("ends the current streak after a day without", () => {
      expect(streaks([day(7), day(8)], today).current).toBe(0);
      expect(streaks([], today)).toEqual({ current: 0, longest: 0 });
    });
  });
});
