import React from "react";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { fetchEntriesRequest } from "../../actions";
import { typeLabel } from "../../common/meterTypes";
import PageHeader from "../layout/PageHeader";
import DateNavigator from "../common/DateNavigator";
import Loading from "../common/Loading";
import MeterAvatar from "../common/MeterAvatar";
import { EntriesErrorSnackbar } from "../common/ErrorSnackbar";
import EntryEditor from "../entries/EntryEditor";
import NoMeters from "./NoMeters";
import useDashboardData from "./useDashboardData";

export const parseDay = ({ year, month, day }) =>
  year && month && day
    ? moment(`${year}-${month}-${day}`, "YYYY-M-D")
    : moment().startOf("day");

/** The entries of all meters on one day, to fill them in. */
const DailyDashboard = () => {
  const history = useHistory();
  const date = parseDay(useParams());
  const dateString = date.format("YYYY-MM-DD");
  const year = date.year();
  const month = date.month() + 1;
  const { meters, entriesByMeter, isLoading } = useDashboardData(
    fetchEntriesRequest(year, month),
    `${year}-${month}`
  );
  const isToday = date.isSame(moment(), "day");

  return (
    <>
      <PageHeader
        title={isToday ? "Today" : date.format("dddd")}
        subtitle={date.format("MMMM D, YYYY")}
      >
        <DateNavigator
          unit="day"
          date={date}
          onChange={(day) =>
            history.push(
              `/dashboard/${day.year()}/${day.month() + 1}/${day.date()}`
            )
          }
        />
      </PageHeader>
      {isLoading ? (
        <Loading />
      ) : meters.length === 0 ? (
        <NoMeters />
      ) : (
        <Grid container spacing={2}>
          {meters.map((meter) => (
            <Grid key={meter.id} size={{ xs: 12, lg: 6 }}>
              <Card sx={{ height: "100%" }}>
                <CardHeader
                  avatar={<MeterAvatar meter={meter} />}
                  title={meter.name}
                  subheader={typeLabel(meter)}
                />
                <CardContent>
                  <EntryEditor
                    meter={meter}
                    date={dateString}
                    entry={(entriesByMeter[meter.id] || []).find(
                      (e) => e.date === dateString
                    )}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <EntriesErrorSnackbar />
    </>
  );
};

export default DailyDashboard;
