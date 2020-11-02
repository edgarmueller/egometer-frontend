import * as _ from "lodash";
import moment from "moment";

const weeksInMonth = (year, month) => {
  // month_number is in the range 1..12
  const firstOfMonth = new Date(year, month - 1, 1);
  const lastOfMonth = new Date(year, month, 0);
  const used = firstOfMonth.getDay() + 6 + lastOfMonth.getDate();

  return Math.floor(used / 7);
};

export const filterEntriesByDate = (entries, fromDate, toDate) => {
  return entries.filter(
    ({ date }) =>
      moment(date, "YYYY-MM-DD") > fromDate &&
      moment(date, "YYYY-MM-DD" < toDate)
  );
};

export const calcMonthlyProgress = (meter, entries, fromDate, toDate) => {
  if (!entries) {
    return undefined;
  }
  const matchingEntries = filterEntriesByDate(entries, fromDate, toDate);
  const weeks = weeksInMonth(fromDate.getFullYear(), fromDate.getMonth() + 1);
  if (meter.weeklyGoal * weeks) {
    const count = _.sumBy(matchingEntries, (e) =>
      goalAccomplished(meter.dailyGoal, e) ? 1 : 0
    );
    return count / _.toNumber(meter.weeklyGoal * weeks);
  }
  return undefined;
};

export const calcWeeklyProgress = (meter, entries, fromDate, toDate) => {
  if (!entries) {
    return undefined;
  }
  const matchingEntries = filterEntriesByDate(entries, fromDate, toDate);
  if (meter.weeklyGoal) {
    const count = _.sumBy(matchingEntries, (e) =>
      goalAccomplished(meter.dailyGoal, e) ? 1 : 0
    );
    return count / _.toNumber(meter.weeklyGoal);
  }
  return undefined;
};

const goalAccomplished = (dailyGoal, entry) => {
  if (_.isBoolean(entry.value)) {
    return entry.value;
  } else if (_.isNumber(entry.value)) {
    return entry.value > (dailyGoal || 0);
  }
  return true;
};
