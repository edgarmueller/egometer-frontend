import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { isEmptyValue } from "../../common/meterTypes";
import { goalProgress } from "../../common/goals";
import { entryIntensity, intensityScale } from "../../common/intensity";
import MeterAvatar from "../common/MeterAvatar";
import GoalChips from "../common/GoalChips";
import EntryCell from "../entries/EntryCell";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const toDateString = (day) => moment(day).format("YYYY-MM-DD");

/**
 * The entries of a meter in a month as a calendar, each day shaded by the
 * intensity of its entry.
 */
const MonthCalendar = ({ meter, days, entries, onEdit }) => {
  const byDate = new Map((entries || []).map((e) => [e.date, e]));
  const scale = intensityScale(meter, entries);
  // the calendar starts on Monday
  const offset = moment(days[0]).isoWeekday() - 1;
  const tracked = days.filter((day) => {
    const entry = byDate.get(toDateString(day));
    return entry && !isEmptyValue(entry.value);
  }).length;
  const progress = goalProgress(meter, entries, days);

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        avatar={<MeterAvatar meter={meter} size={32} />}
        title={meter.name}
        subheader={`${tracked} of ${days.length} days`}
      />
      <CardContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: 0.75,
          }}
        >
          {WEEKDAYS.map((weekday) => (
            <Typography
              key={weekday}
              variant="caption"
              align="center"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              {weekday}
            </Typography>
          ))}
          {offset > 0 && <Box sx={{ gridColumn: `span ${offset}` }} />}
          {days.map((day) => {
            const date = toDateString(day);
            const entry = byDate.get(date);
            return (
              <EntryCell
                key={date}
                meter={meter}
                date={date}
                entry={entry}
                intensity={entryIntensity(meter, entry && entry.value, scale)}
                label={day.getDate()}
                onEdit={onEdit}
              />
            );
          })}
        </Box>
        {progress.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <GoalChips progress={progress} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

MonthCalendar.propTypes = {
  meter: PropTypes.object.isRequired,
  days: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  entries: PropTypes.arrayOf(PropTypes.object),
  onEdit: PropTypes.func.isRequired,
};

export default MonthCalendar;
