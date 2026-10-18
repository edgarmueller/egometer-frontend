import { isEmptyValue, meterType } from "./meterTypes";

/**
 * The largest value of the entries, which the intensity of numbers and
 * activities is relative to, at least a number meter's daily goal.
 */
export const intensityScale = (meter, entries) => {
  const values = (entries || []).map((e) =>
    meter.type === "activities" ? (e.value || []).length : e.value
  );
  const numbers = values.filter((v) => typeof v === "number" && v > 0);
  return Math.max(1, meter.dailyGoal || 0, ...numbers);
};

/**
 * How strongly a value is shown, from 0 to 1: how good a mood, how much of a
 * quantity, how large a number or how many activities.
 */
export const entryIntensity = (meter, value, scale = 1) => {
  if (isEmptyValue(value)) {
    return 0;
  }
  const { values } = meterType(meter);
  if (values) {
    const index = values.indexOf(value);
    return index === -1 ? 0 : (index + 1) / values.length;
  }
  switch (meter.type) {
    case "number":
      return Math.min(1, Math.max(0, value) / scale);
    case "activities":
      return Math.min(1, value.length / scale);
    case "text":
      // a note is there or not
      return 0.5;
    default:
      return 1;
  }
};
