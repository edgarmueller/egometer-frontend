import moment from "moment";
import { MOOD_VALUES, activityLabel } from "./meterTypes";

// fewest days with and without a factor to compare the mood of
export const MIN_DAYS = 3;
// smallest difference of the mood worth showing
export const MIN_DIFFERENCE = 0.15;

/** A mood as a score from 1 (awful) to 5 (great), or undefined. */
export const moodScore = (value) => {
  const index = MOOD_VALUES.indexOf(value);
  return index === -1 ? undefined : index + 1;
};

const average = (numbers) =>
  numbers.length === 0
    ? undefined
    : numbers.reduce((a, b) => a + b, 0) / numbers.length;

/** The mood scores by date of a mood meter's entries. */
export const moodByDate = (entries) =>
  new Map(
    (entries || [])
      .map((entry) => [entry.date, moodScore(entry.value)])
      .filter(([, score]) => score !== undefined)
  );

export const averageMood = (moods) => average([...moods.values()]);

/**
 * The things that might go along with the mood of a day: each tag of the
 * activities meters and each yes/no meter. A factor has the dates it applies
 * to and the dates it is known not to apply to.
 */
export const factorsOf = (meters, entriesByMeter) =>
  meters.flatMap((meter) => {
    const entries = entriesByMeter[meter.id] || [];
    if (meter.type === "boolean") {
      const yes = new Set(entries.filter((e) => e.value).map((e) => e.date));
      // a day without an entry is a no
      return [
        { label: meter.name, meter, dates: yes, isNo: (d) => !yes.has(d) },
      ];
    }
    if (meter.type === "activities") {
      // only days with tags tell which tags weren't there
      const tagged = new Map(entries.map((e) => [e.date, e.value || []]));
      const tags = new Set([
        ...(meter.options || []),
        ...entries.flatMap((e) => e.value || []),
      ]);
      return [...tags].map((tag) => ({
        label: activityLabel(tag),
        meter,
        dates: new Set(
          [...tagged].filter(([, t]) => t.includes(tag)).map(([d]) => d)
        ),
        isNo: (d) => tagged.has(d) && !tagged.get(d).includes(tag),
      }));
    }
    return [];
  });

/**
 * How much better or worse the mood is on days with each factor than on
 * days without it, best first. Factors without enough days on either side
 * are left out.
 */
export const moodByFactor = (moods, factors) =>
  factors
    .map((factor) => {
      const withScores = [];
      const withoutScores = [];
      moods.forEach((score, date) => {
        if (factor.dates.has(date)) {
          withScores.push(score);
        } else if (factor.isNo(date)) {
          withoutScores.push(score);
        }
      });
      return {
        label: factor.label,
        meter: factor.meter,
        days: withScores.length,
        withMood: average(withScores),
        withoutMood: average(withoutScores),
        difference: average(withScores) - average(withoutScores),
        enoughData:
          withScores.length >= MIN_DAYS && withoutScores.length >= MIN_DAYS,
      };
    })
    .filter((result) => result.enoughData)
    .sort((a, b) => b.difference - a.difference);

/** The average mood per weekday, Monday first, undefined without moods. */
export const moodByWeekday = (moods) => {
  const scores = [...Array(7)].map(() => []);
  moods.forEach((score, date) => {
    scores[moment(date).isoWeekday() - 1].push(score);
  });
  return scores.map((s) => ({ mood: average(s), days: s.length }));
};

/**
 * The current and longest run of consecutive dates. The current streak
 * still counts if today isn't tracked yet, as the day isn't over.
 */
export const streaks = (dates, today = moment()) => {
  const sorted = [...new Set(dates)].sort();
  let longest = 0;
  let run = 0;
  let previous;
  sorted.forEach((date) => {
    const day = moment(date);
    run = previous && day.diff(previous, "days") === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = day;
  });
  const has = new Set(sorted);
  let current = 0;
  const day = moment(today).startOf("day");
  if (!has.has(day.format("YYYY-MM-DD"))) {
    day.subtract(1, "day");
  }
  while (has.has(day.format("YYYY-MM-DD"))) {
    current += 1;
    day.subtract(1, "day");
  }
  return { current, longest };
};
