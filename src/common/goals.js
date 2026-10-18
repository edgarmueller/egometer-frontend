import moment from "moment";

const toDateString = (day) => moment(day).format("YYYY-MM-DD");

/** Whether the entry of a number meter reaches the meter's daily goal. */
export const isDailyGoalReached = (meter, entry) =>
  meter.type === "number" &&
  meter.dailyGoal > 0 &&
  !!entry &&
  entry.value >= meter.dailyGoal;

/**
 * The days on which the daily goal of a number meter was reached and how
 * many of them the meter's weekly goal asks for within the given days, or
 * undefined if the meter has no weekly goal.
 */
export const goalProgress = (meter, entries, days) => {
  if (meter.type !== "number" || !(meter.weeklyGoal > 0)) {
    return undefined;
  }
  const dates = new Set(days.map(toDateString));
  const reached = (entries || []).filter(
    (entry) =>
      dates.has(entry.date) &&
      // without a daily goal, any entry counts
      (meter.dailyGoal > 0 ? isDailyGoalReached(meter, entry) : true)
  ).length;
  const target = Math.max(1, Math.round((meter.weeklyGoal * days.length) / 7));
  return { reached, target: Math.min(target, days.length) };
};
