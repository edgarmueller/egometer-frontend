import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { activityLabel, meterType, typeLabel } from "../../common/meterTypes";
import MeterAvatar, { DEFAULT_METER_COLOR } from "../common/MeterAvatar";

const CHART_HEIGHT = 240;

const toDateString = (day) => moment(day).format("YYYY-MM-DD");

// weekdays for a week, the day of the month otherwise
const dayLabels = (days) =>
  days.map((day) =>
    days.length <= 7 ? moment(day).format("ddd") : String(day.getDate())
  );

const valuesByDay = (entries, days) => {
  const byDate = new Map((entries || []).map((e) => [e.date, e.value]));
  return days.map((day) => byDate.get(toDateString(day)));
};

const Empty = () => (
  <Box
    sx={{
      height: CHART_HEIGHT,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography color="text.secondary">Nothing tracked yet</Typography>
  </Box>
);

const Stat = ({ label, value }) => (
  <Box>
    <Typography variant="overline" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h6" component="p">
      {value}
    </Typography>
  </Box>
);

Stat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
};

/** The values of a mood or quantity meter over the days, worst to best. */
export const LevelChart = ({ meter, days, entries }) => {
  const { values, valueLabels } = meterType(meter);
  const levels = valuesByDay(entries, days).map((value) =>
    values.includes(value) ? values.indexOf(value) : null
  );
  if (levels.every((level) => level === null)) {
    return <Empty />;
  }
  return (
    <LineChart
      height={CHART_HEIGHT}
      hideLegend
      grid={{ horizontal: true }}
      xAxis={[{ scaleType: "point", data: dayLabels(days) }]}
      yAxis={[
        {
          min: 0,
          max: values.length - 1,
          tickInterval: values.map((v, i) => i),
          valueFormatter: (i) => valueLabels[values[i]] || "",
          width: 60,
        },
      ]}
      series={[
        {
          data: levels,
          color: meter.color || DEFAULT_METER_COLOR,
          curve: "linear",
          showMark: true,
          valueFormatter: (i) => (i === null ? "–" : valueLabels[values[i]]),
        },
      ]}
    />
  );
};

/** The values of a number meter per day, with some statistics. */
export const NumberChart = ({ meter, days, entries }) => {
  const values = valuesByDay(entries, days);
  const tracked = values.filter((v) => typeof v === "number");
  if (tracked.length === 0) {
    return <Empty />;
  }
  const average = tracked.reduce((a, b) => a + b, 0) / tracked.length;
  const format = (n) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return (
    <>
      <Box sx={{ display: "flex", gap: 4, mb: 1 }}>
        <Stat label="Average" value={format(average)} />
        <Stat label="Min" value={format(Math.min(...tracked))} />
        <Stat label="Max" value={format(Math.max(...tracked))} />
        {meter.dailyGoal > 0 && (
          <Stat label="Daily goal" value={format(meter.dailyGoal)} />
        )}
      </Box>
      <BarChart
        height={CHART_HEIGHT - 60}
        hideLegend
        borderRadius={4}
        grid={{ horizontal: true }}
        xAxis={[{ scaleType: "band", data: dayLabels(days) }]}
        yAxis={[{ width: 40 }]}
        series={[
          {
            data: values.map((v) => (typeof v === "number" ? v : null)),
            color: meter.color || DEFAULT_METER_COLOR,
          },
        ]}
      />
    </>
  );
};

/** How often each tag of an activities meter was used. */
export const ActivitiesChart = ({ meter, days, entries }) => {
  const counts = new Map();
  valuesByDay(entries, days).forEach((tags) =>
    (tags || []).forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1))
  );
  if (counts.size === 0) {
    return <Empty />;
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  return (
    <BarChart
      height={Math.max(120, sorted.length * 34 + 40)}
      layout="horizontal"
      hideLegend
      borderRadius={4}
      grid={{ vertical: true }}
      yAxis={[
        {
          scaleType: "band",
          data: sorted.map(([tag]) => activityLabel(tag)),
          width: 100,
        },
      ]}
      xAxis={[{ tickMinStep: 1 }]}
      series={[
        {
          data: sorted.map(([, count]) => count),
          color: meter.color || DEFAULT_METER_COLOR,
          valueFormatter: (count) => `${count} ${count === 1 ? "day" : "days"}`,
        },
      ]}
    />
  );
};

/** On how many of the days a yes/no meter was yes. */
export const BooleanChart = ({ meter, days, entries }) => {
  const yes = valuesByDay(entries, days).filter((v) => v === true).length;
  // days in the future can't be tracked yet
  const elapsed = days.filter((day) =>
    moment(day).isSameOrBefore(moment(), "day")
  ).length;
  const total = Math.max(elapsed, 1);
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" component="p">
        {yes}
        <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
          of {elapsed} {elapsed === 1 ? "day" : "days"}
        </Typography>
      </Typography>
      <LinearProgress
        variant="determinate"
        value={Math.min(100, (yes / total) * 100)}
        aria-label={`${meter.name}: ${yes} of ${elapsed} days`}
        sx={{
          mt: 2,
          height: 10,
          borderRadius: 5,
          bgcolor: alpha(meter.color || DEFAULT_METER_COLOR, 0.15),
          "& .MuiLinearProgress-bar": {
            borderRadius: 5,
            bgcolor: meter.color || DEFAULT_METER_COLOR,
          },
        }}
      />
    </Box>
  );
};

const chartPropTypes = {
  meter: PropTypes.object.isRequired,
  days: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  entries: PropTypes.arrayOf(PropTypes.object),
};
[LevelChart, NumberChart, ActivitiesChart, BooleanChart].forEach((Chart) => {
  Chart.propTypes = chartPropTypes;
});

const CHARTS = {
  mood: LevelChart,
  quantity: LevelChart,
  number: NumberChart,
  activities: ActivitiesChart,
  boolean: BooleanChart,
};

/** A chart for each meter (except journals) of its entries on the days. */
const MeterCharts = ({ meters, days, entriesByMeter }) => {
  const charted = meters.filter((meter) => CHARTS[meter.type]);
  if (charted.length === 0) {
    return null;
  }
  return (
    <Grid container spacing={2} sx={{ mt: 3 }}>
      {charted.map((meter) => {
        const Chart = CHARTS[meter.type];
        return (
          <Grid key={meter.id} size={{ xs: 12, lg: 6 }}>
            <Card sx={{ height: "100%" }}>
              <CardHeader
                avatar={<MeterAvatar meter={meter} size={32} />}
                title={meter.name}
                subheader={typeLabel(meter)}
              />
              <CardContent>
                <Chart
                  meter={meter}
                  days={days}
                  entries={entriesByMeter[meter.id]}
                />
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

MeterCharts.propTypes = {
  meters: PropTypes.arrayOf(PropTypes.object).isRequired,
  days: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  entriesByMeter: PropTypes.object.isRequired,
};

export default MeterCharts;
