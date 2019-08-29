import React, { Fragment } from "react";
import moment from "moment";
import sortBy from "lodash/sortBy";
import { lastDayOfMonth } from "../../common/date";

const calcStreak = data => {
  const sorted = sortBy(data, e => moment(e.date, "YYYY-MM-DD").toDate());
  const streak = sorted.reduce(
    ({ longest, current, prevDate }, { date, value }) => {
      const day = moment(date, "YYYY-MM-DD").date();
      if (day - 1 === prevDate || prevDate === -1) {
        if (value) {
          const curr = current + 1;
          if (curr > longest) {
            return { longest: curr, current: curr, prevDate: day };
          }
          return { longest, current: curr, prevDate: day };
        } else {
          return { longest, current: 0, prevDate: day };
        }
      }
      return { longest, current: value ? 1 : 0, prevDate: day };
    },
    { longest: 0, current: 0, prevDate: -1 }
  );
  return streak.longest;
};

const BooleanStats = ({ data, days, meter, width }) => {
  if (!data) {
    return <div>No data</div>;
  }
  const monthDays = lastDayOfMonth(days[0].getMonth(), days[0].getFullYear());
  const yes = data.filter(({ value }) => value).length;
  const streak = calcStreak(data);
  return (
    <Fragment>
      <div>
        <strong>Did so</strong>: {yes} out of {monthDays}
      </div>
      <div>
        <strong>Longest streak</strong>: {streak}
      </div>
    </Fragment>
  );
};

export default BooleanStats;
