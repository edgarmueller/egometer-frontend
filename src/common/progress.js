import * as _ from "lodash";

export const calcProgress = (entries, meters, days) => {
  return Object.keys(entries).reduce((acc, meterId) => {
    const foundMeter = _.find(meters, ({ id }) => id === meterId);
    if (!foundMeter || !foundMeter.weeklyGoal) {
      return acc;
    }
    const entriesSoFar = entries[meterId].filter(entry => {
      const entryDate = new Date(entry.date);
      const first = _.first(days);
      const last = _.last(days);
      return (
        entryDate.getTime() >= first.getTime() &&
        entryDate.getTime() <= last.getTime() &&
        Number(entry.value) >= foundMeter.dailyGoal
      );
    });
    acc[foundMeter.id] = entriesSoFar.length / foundMeter.weeklyGoal;
    return acc;
  }, {});
};
