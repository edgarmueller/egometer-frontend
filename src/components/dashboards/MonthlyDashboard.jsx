import React from "react";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { fetchEntriesRequest } from "../../actions";
import PageHeader from "../layout/PageHeader";
import DateNavigator from "../common/DateNavigator";
import Loading from "../common/Loading";
import { EntriesErrorSnackbar } from "../common/ErrorSnackbar";
import MeterCharts from "../charts/MeterCharts";
import Grid from "@mui/material/Grid";
import useEntryPopover from "../entries/useEntryPopover";
import MonthCalendar from "./MonthCalendar";
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
  const { openEditor, popover } = useEntryPopover(meters, entriesByMeter);

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
          <Grid container spacing={2}>
            {meters.map((meter) => (
              <Grid key={meter.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <MonthCalendar
                  meter={meter}
                  days={days}
                  entries={entriesByMeter[meter.id]}
                  onEdit={openEditor}
                />
              </Grid>
            ))}
          </Grid>
          {popover}
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
