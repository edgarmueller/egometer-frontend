import moment from "moment";
import * as _ from "lodash";

export const calcProgress = (entries, meters, days) => {
    return Object.keys(entries).reduce((acc, meterId) => {
        const foundMeter = _.find(meters, ({ id }) => id === meterId);
        if (!foundMeter || !foundMeter.weeklyGoal) {
            return acc;
        }
        const entriesSoFar = entries[meterId].filter(entry => {
            const entryDate = new Date(entry.date)
            let first;
            let last;
            if (days.length === 1) {
                first = new Date(_.first(days));
                first.setHours(0, 0, 0, 0);
                last = new Date(_.first(days));
                last.setDate(_.first(days).getDate() + 1);
                last.setHours(0, 0, 0, 0)
                return (
                    entryDate.getTime() >= first.getTime() &&
                    entryDate.getTime() <= last.getTime() &&
                    Number(entry.value) >= foundMeter.dailyGoal
                );
            } else {
                first = new Date(_.first(days));
                last = new Date(_.last(days));
                first.setHours(0, 0, 0, 0);
                last.setHours(0, 0, 0, 0);
                return (
                    entryDate.getTime() >= first.getTime() &&
                    entryDate.getTime() <= last.getTime() &&
                    Number(entry.value) >= foundMeter.dailyGoal
                );
            }
        });
        acc[foundMeter.id] = {
            meter: foundMeter,
            entries: entriesSoFar,
            progress: entriesSoFar.length / foundMeter.weeklyGoal
        };
        return acc;
    }, {})
};

export const getProgress = (progressPerMeter, meterId, date) => {
    if (progressPerMeter) {
        const foundMeter = progressPerMeter[meterId];
        if (foundMeter && date) {
            const foundEntry = foundMeter.entries.find(e => e.date === date);
            if (foundEntry) {
                return { progress: foundEntry.value / foundMeter.meter.dailyGoal };
            }
            return undefined;
        }
        return progressPerMeter[meterId];
    }
    return undefined;
};