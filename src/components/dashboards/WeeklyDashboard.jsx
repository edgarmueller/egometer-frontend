import React from "react";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { fetchEntriesRequestByWeek } from "../../actions";
import PageHeader from "../layout/PageHeader";
import DateNavigator from "../common/DateNavigator";
import Loading from "../common/Loading";
import { EntriesErrorSnackbar } from "../common/ErrorSnackbar";
import MeterCharts from "../charts/MeterCharts";
import MeterMatrix from "./MeterMatrix";
import NoMeters from "./NoMeters";
import useDashboardData from "./useDashboardData";

// the Monday of an ISO week, the current week by default
export const parseWeek = ({ year, week }) =>
  year && week
    ? moment()
        .isoWeekYear(Number(year))
        .isoWeek(Number(week))
        .startOf("isoWeek")
    : moment().startOf("isoWeek");

export const daysFrom = (start, count) =>
  Array.from({ length: count }, (_, i) =>
    moment(start).add(i, "days").toDate()
  );

/** The entries of all meters in one week, with charts of them. */
const WeeklyDashboard = () => {
  const history = useHistory();
  const start = parseWeek(useParams());
  const year = start.isoWeekYear();
  const week = start.isoWeek();
  const days = daysFrom(start, 7);
  const { meters, entriesByMeter, isLoading } = useDashboardData(
    fetchEntriesRequestByWeek(year, week),
    `${year}-${week}`
  );

  return (
    <>
      <PageHeader title={`Week ${week}`} subtitle="Your week at a glance">
        <DateNavigator
          unit="week"
          date={start}
          onChange={(day) =>
            history.push(`/weekly/${day.isoWeekYear()}/${day.isoWeek()}`)
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

export default WeeklyDashboard;
