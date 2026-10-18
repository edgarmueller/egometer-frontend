import moment from "moment";
import { activityLabel, isEmptyValue } from "./meterTypes";

const toDateString = (day) => moment(day).format("YYYY-MM-DD");

/** Whether the entry of a number meter reaches the meter's daily goal. */
export const isDailyGoalReached = (meter, entry) =>
  meter.type === "number" &&
  meter.dailyGoal > 0 &&
  !!entry &&
  entry.value >= meter.dailyGoal;

/**
 * Whether a value meets a meter on its day: a yes, reaching the daily goal
 * of a number meter (any number without one), more than none of a quantity
 * and any value otherwise.
 */
export const meetsMeter = (meter, value) => {
  if (isEmptyValue(value)) {
    return false;
  }
  switch (meter.type) {
    case "number":
      return meter.dailyGoal > 0 ? value >= meter.dailyGoal : true;
    case "quantity":
      return value !== "none";
    default:
      return true;
  }
};

/**
 * The goals of a meter: its weekly goal, or one per activity of an
 * activities meter. Each goal has a label (the activity, if any), the days a week it asks
 * for and tells which values meet it.
 */
export const meterGoals = (meter) => {
  if (meter.type === "activities") {
    return (meter.activityGoals || []).map(({ activity, timesPerWeek }) => ({
      key: activity,
      label: activityLabel(activity),
      timesPerWeek,
      isMet: (value) => (value || []).includes(activity),
    }));
  }
  return meter.weeklyGoal > 0
    ? [
        {
          key: "weekly",
          label: undefined,
          timesPerWeek: meter.weeklyGoal,
          isMet: (value) => meetsMeter(meter, value),
        },
      ]
    : [];
};

/** The number of days a goal asks for within the given number of days. */
export const goalTarget = (timesPerWeek, dayCount) =>
  Math.min(dayCount, Math.max(1, Math.round((timesPerWeek * dayCount) / 7)));

/**
 * For each goal of the meter, on how many of the days it was met and how
 * many it asks for.
 */
export const goalProgress = (meter, entries, days) => {
  const dates = new Set(days.map(toDateString));
  const values = (entries || [])
    .filter((entry) => dates.has(entry.date))
    .map((entry) => entry.value);
  return meterGoals(meter).map((goal) => ({
    key: goal.key,
    label: goal.label,
    timesPerWeek: goal.timesPerWeek,
    reached: values.filter(goal.isMet).length,
    target: goalTarget(goal.timesPerWeek, days.length),
  }));
};

/**
 * How a goal went week by week, from the ISO week of `from` to the current
 * one: how many full weeks met it, the streak of weeks in a row that did
 * and the progress of the current week, which only counts towards the
 * streak once it is met.
 */
export const goalHistory = (goal, entries, from, today = moment()) => {
  const metWeeks = new Map();
  (entries || []).forEach((entry) => {
    if (goal.isMet(entry.value)) {
      const week = moment(entry.date).startOf("isoWeek").format("YYYY-MM-DD");
      metWeeks.set(week, (metWeeks.get(week) || 0) + 1);
    }
  });
  const currentWeek = moment(today).startOf("isoWeek");
  const isMet = (week) =>
    (metWeeks.get(week.format("YYYY-MM-DD")) || 0) >= goal.timesPerWeek;

  const weeks = [];
  for (
    const week = moment(from).startOf("isoWeek");
    week.isBefore(currentWeek);
    week.add(1, "week")
  ) {
    weeks.push(isMet(week));
  }
  let streak = 0;
  while (streak < weeks.length && weeks[weeks.length - 1 - streak]) {
    streak += 1;
  }
  const thisWeek = metWeeks.get(currentWeek.format("YYYY-MM-DD")) || 0;
  return {
    weeksMet: weeks.filter(Boolean).length,
    weeks: weeks.length,
    streak: streak + (thisWeek >= goal.timesPerWeek ? 1 : 0),
    thisWeek,
  };
};
