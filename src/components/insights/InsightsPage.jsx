import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import SentimentSatisfiedRounded from "@mui/icons-material/SentimentSatisfiedRounded";
import EventAvailableRounded from "@mui/icons-material/EventAvailableRounded";
import InsightsRounded from "@mui/icons-material/InsightsRounded";
import { BarChart } from "@mui/x-charts/BarChart";
import { METER_TYPES, MOOD_VALUES } from "../../common/meterTypes";
import {
  averageMood,
  factorsOf,
  moodByDate,
  moodByFactor,
  moodByWeekday,
  streaks,
  MIN_DAYS,
  MIN_DIFFERENCE,
} from "../../common/insights";
import PageHeader from "../layout/PageHeader";
import Loading from "../common/Loading";
import EmptyState from "../common/EmptyState";
import MeterAvatar, { DEFAULT_METER_COLOR } from "../common/MeterAvatar";
import NoMeters from "../dashboards/NoMeters";
import useInsightsData from "./useInsightsData";

const PERIODS = [
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 365, label: "Year" },
];

const { valueLabels: MOOD_LABELS } = METER_TYPES.mood;
// the label of the mood a score is closest to
const moodLabel = (score) => MOOD_LABELS[MOOD_VALUES[Math.round(score) - 1]];
const formatScore = (score) => score.toFixed(1);

const pluralDays = (n) => `${n} ${n === 1 ? "day" : "days"}`;

const StatCard = ({ icon, label, value, caption }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      <Box sx={{ color: "primary.main", display: "flex", pt: 0.5 }}>{icon}</Box>
      <Box>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" component="p">
          {value}
        </Typography>
        {caption && (
          <Typography variant="body2" color="text.secondary">
            {caption}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

StatCard.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  caption: PropTypes.node,
};

/** One bar per factor, to the right if the mood is better with it. */
export const MoodFactors = ({ factors }) => {
  if (factors.length === 0) {
    return (
      <EmptyState
        icon={<InsightsRounded sx={{ fontSize: 40 }} />}
        title="Not enough data yet"
      >
        Track your mood along with activities or yes/no meters. Once something
        happened on at least {MIN_DAYS} days, and didn&apos;t on {MIN_DAYS}{" "}
        others, it shows up here.
      </EmptyState>
    );
  }
  const scale = Math.max(...factors.map((f) => Math.abs(f.difference)), 0.5);
  return (
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
      {factors.map((factor) => {
        const isBetter = factor.difference >= 0;
        const width = `${(Math.abs(factor.difference) / scale) * 50}%`;
        return (
          <Tooltip
            key={`${factor.meter.id}-${factor.label}`}
            title={`Mood ${formatScore(factor.withMood)} on ${pluralDays(
              factor.days
            )} with, ${formatScore(factor.withoutMood)} without`}
          >
            <Box
              component="li"
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "110px 1fr 48px",
                  sm: "180px 1fr 56px",
                },
                alignItems: "center",
                gap: 2,
                py: 0.75,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                  {factor.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {factor.meter.type === "activities"
                    ? `${factor.meter.name} · ${pluralDays(factor.days)}`
                    : pluralDays(factor.days)}
                </Typography>
              </Box>
              <Box
                aria-hidden
                sx={{
                  position: "relative",
                  height: 12,
                  borderRadius: 6,
                  bgcolor: "action.hover",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: isBetter ? "50%" : `calc(50% - ${width})`,
                    width,
                    borderRadius: 6,
                    bgcolor: isBetter ? "success.main" : "error.main",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: -4,
                    bottom: -4,
                    left: "50%",
                    width: "1px",
                    bgcolor: "text.disabled",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                align="right"
                sx={{
                  fontWeight: 700,
                  color: isBetter ? "success.main" : "error.main",
                }}
              >
                {isBetter ? "+" : "−"}
                {formatScore(Math.abs(factor.difference))}
              </Typography>
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};

MoodFactors.propTypes = {
  factors: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const WeekdayChart = ({ moods, color }) => {
  const byWeekday = moodByWeekday(moods);
  return (
    <BarChart
      height={260}
      hideLegend
      borderRadius={4}
      grid={{ horizontal: true }}
      xAxis={[{ scaleType: "band", data: WEEKDAYS }]}
      yAxis={[
        {
          min: 1,
          max: 5,
          tickInterval: [1, 2, 3, 4, 5],
          valueFormatter: moodLabel,
          width: 60,
        },
      ]}
      series={[
        {
          data: byWeekday.map(({ mood }) => (mood === undefined ? null : mood)),
          color,
          valueFormatter: (mood, { dataIndex }) =>
            mood === null
              ? "–"
              : `${formatScore(mood)} (${moodLabel(mood)}), ${pluralDays(
                  byWeekday[dataIndex].days
                )}`,
        },
      ]}
    />
  );
};

WeekdayChart.propTypes = {
  moods: PropTypes.instanceOf(Map).isRequired,
  color: PropTypes.string,
};

const Streaks = ({ meters, entriesByMeter }) => (
  <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
    {meters.map((meter) => {
      const { current, longest } = streaks(
        (entriesByMeter[meter.id] || [])
          .filter((e) => e.value)
          .map((e) => e.date)
      );
      return (
        <Box
          component="li"
          key={meter.id}
          sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}
        >
          <MeterAvatar meter={meter} size={32} />
          <Typography sx={{ flexGrow: 1, fontWeight: 600 }} noWrap>
            {meter.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: current > 0 ? "warning.main" : "text.disabled",
            }}
          >
            <LocalFireDepartmentRounded fontSize="small" />
            <Typography sx={{ fontWeight: 700 }}>
              {pluralDays(current)}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ width: 90, textAlign: "right" }}
          >
            best {longest}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

Streaks.propTypes = {
  meters: PropTypes.arrayOf(PropTypes.object).isRequired,
  entriesByMeter: PropTypes.object.isRequired,
};

/** What the entries of a period say: streaks and what goes with good days. */
const InsightsPage = () => {
  const [days, setDays] = useState(90);
  const { meters, entriesByMeter, isLoading, error } = useInsightsData(days);
  const moodMeters = meters.filter((m) => m.type === "mood");
  const [selectedMoodId, setMoodId] = useState(undefined);
  const moodMeter =
    moodMeters.find((m) => m.id === selectedMoodId) || moodMeters[0];
  const booleanMeters = meters.filter((m) => m.type === "boolean");

  const header = (
    <PageHeader title="Insights" subtitle="What your tracking says about you">
      <ToggleButtonGroup
        exclusive
        size="small"
        value={days}
        onChange={(event, value) => value && setDays(value)}
        aria-label="Period"
      >
        {PERIODS.map((period) => (
          <ToggleButton key={period.days} value={period.days} sx={{ px: 2 }}>
            {period.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </PageHeader>
  );

  if (meters.length === 0) {
    return (
      <>
        {header}
        <NoMeters />
      </>
    );
  }
  if (isLoading) {
    return (
      <>
        {header}
        <Loading />
      </>
    );
  }
  if (error) {
    return (
      <>
        {header}
        <Alert severity="error">
          The insights could not be loaded, please try again later.
        </Alert>
      </>
    );
  }

  const trackedDates = Object.values(entriesByMeter).flatMap((entries) =>
    entries.map((e) => e.date)
  );
  const logging = streaks(trackedDates);
  const trackedDays = new Set(trackedDates).size;
  const moods = moodByDate(moodMeter && entriesByMeter[moodMeter.id]);
  const mood = averageMood(moods);
  const allFactors = moodByFactor(moods, factorsOf(meters, entriesByMeter));
  const factors = allFactors.filter(
    (f) => Math.abs(f.difference) >= MIN_DIFFERENCE
  );
  const streaksCard = booleanMeters.length > 0 && (
    <Card>
      <CardHeader title="Streaks" subheader="Days in a row of yes" />
      <CardContent sx={{ pt: 1 }}>
        <Streaks meters={booleanMeters} entriesByMeter={entriesByMeter} />
      </CardContent>
    </Card>
  );

  const moodSelect = moodMeters.length > 1 && (
    <TextField
      select
      size="small"
      label="Mood meter"
      value={moodMeter.id}
      onChange={(event) => setMoodId(event.target.value)}
    >
      {moodMeters.map((m) => (
        <MenuItem key={m.id} value={m.id}>
          {m.name}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <>
      {header}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            icon={<LocalFireDepartmentRounded />}
            label="Tracking streak"
            value={pluralDays(logging.current)}
            caption={`Best: ${pluralDays(logging.longest)}`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            icon={<EventAvailableRounded />}
            label="Days tracked"
            value={`${trackedDays} of ${days}`}
            caption={`Since ${moment()
              .subtract(days - 1, "days")
              .format("MMM D, YYYY")}`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            icon={<SentimentSatisfiedRounded />}
            label="Average mood"
            value={mood === undefined ? "–" : moodLabel(mood)}
            caption={
              mood === undefined
                ? "No mood tracked"
                : `${formatScore(mood)} of 5 on ${pluralDays(moods.size)}`
            }
          />
        </Grid>
        {moodMeter ? (
          <>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ height: "100%" }}>
                <CardHeader
                  title="What goes along with your mood"
                  subheader="Average mood on days with each, compared to days without"
                  action={moodSelect}
                />
                <CardContent>
                  <MoodFactors factors={factors} />
                  {factors.length > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      component="p"
                      sx={{ mt: 2 }}
                    >
                      {allFactors.length > factors.length &&
                        `${
                          allFactors.length - factors.length
                        } more barely make a difference. `}
                      These go along with your mood, they don&apos;t necessarily
                      cause it.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid
              size={{ xs: 12, lg: 5 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Card>
                <CardHeader
                  title="Mood by weekday"
                  subheader={moodMeter.name}
                />
                <CardContent>
                  {moods.size === 0 ? (
                    <EmptyState title="No mood tracked yet" />
                  ) : (
                    <WeekdayChart
                      moods={moods}
                      color={moodMeter.color || DEFAULT_METER_COLOR}
                    />
                  )}
                </CardContent>
              </Card>
              {streaksCard}
            </Grid>
          </>
        ) : (
          <Grid size={12}>
            <Card>
              <EmptyState
                icon={<SentimentSatisfiedRounded sx={{ fontSize: 40 }} />}
                title="Track your mood"
                action={
                  <Button variant="contained" component={Link} to="/meters">
                    Add a mood meter
                  </Button>
                }
              >
                With a mood meter, you&apos;ll see which activities go along
                with good days and how your weekdays compare.
              </EmptyState>
            </Card>
          </Grid>
        )}
        {!moodMeter && streaksCard && <Grid size={12}>{streaksCard}</Grid>}
      </Grid>
    </>
  );
};

export default InsightsPage;
