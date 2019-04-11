import React, { Fragment } from "react";
import { lastDayOfMonth } from "../../common/date";

const BooleanStats = ({ data, days, meter, width }) => {
  if (!data) {
    return <div>No data</div>;
  }
  const monthDays = lastDayOfMonth(days[0].getMonth(), days[0].getFullYear());
  const yes = data.filter(({ value }) => value).length;
  const streak = data.reduce(
    ({ longest, current }, { value }) => {
      if (value) {
        const curr = current + 1;
        if (curr > longest) {
          return { current: curr, longest: curr };
        }
        return { longest, current: curr };
      }
      return { longest, current: 0 };
    },
    { longest: 0, current: 0 }
  );
  return (
    <Fragment>
      <div>
        <strong>Did so</strong>: {yes} out of {monthDays}
      </div>
      <div>
        <strong>Longest streak</strong>: {streak.longest}
      </div>
    </Fragment>
  );
};

export default BooleanStats;
