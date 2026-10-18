import React from "react";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { fetchEntriesRequest } from "../../actions";
import PageHeader from "../layout/PageHeader";
import DateNavigator from "../common/DateNavigator";
import Loading from "../common/Loading";
import { EntriesErrorSnackbar } from "../common/ErrorSnackbar";
import MeterCharts from "../charts/MeterCharts";
import MeterMatrix from "./MeterMatrix";
import NoMeters from "./NoMeters";
import useDashboardData from "./useDashboardData";
import { daysFrom } from "./WeeklyDashboard";

// the first day of a month, the current month by default
export const parseMonth = ({ year, month }) =>
  year && month
    ? moment(`${year}-${month}-1`, "YYYY-M-D")
    : moment().startOf("month");

/** The entries of all meters in one month, with charts of them. */
const MonthlyDashboard = () => {
  const history = useHistory();
  const start = parseMonth(useParams());
  const year = start.year();
  const month = start.month() + 1;
  const days = daysFrom(start, start.daysInMonth());
  const { meters, entriesByMeter, isLoading } = useDashboardData(
    fetchEntriesRequest(year, month),
    `${year}-${month}`
  );

  return (
    <>
      <PageHeader
        title={start.format("MMMM")}
        subtitle="Your month at a glance"
      >
        <DateNavigator
          unit="month"
          date={start}
          onChange={(day) =>
            history.push(`/matrix/${day.year()}/${day.month() + 1}`)
          }
        />
      </PageHeader>
      {isLoading ? (
        <Loading />
      ) : meters.length === 0 ? (
        <NoMeters />
      ) : (
        <>
          <MeterMatrix
            meters={meters}
            days={days}
            entriesByMeter={entriesByMeter}
          />
          <MeterCharts
            meters={meters}
            days={days}
            entriesByMeter={entriesByMeter}
          />
        </>
      )}
      <EntriesErrorSnackbar />
    </>
  );
};

export default MonthlyDashboard;
