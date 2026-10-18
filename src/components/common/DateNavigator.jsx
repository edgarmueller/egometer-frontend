import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

// weeks are ISO weeks, starting on Monday
const START_OF = { day: "day", week: "isoWeek", month: "month" };

export const formatPeriod = (date, unit) => {
  switch (unit) {
    case "week": {
      const start = moment(date).startOf("isoWeek");
      const end = moment(date).endOf("isoWeek");
      return start.month() === end.month()
        ? `${start.format("MMM D")} – ${end.format("D, YYYY")}`
        : `${start.format("MMM D")} – ${end.format("MMM D, YYYY")}`;
    }
    case "month":
      return moment(date).format("MMMM YYYY");
    default:
      return moment(date).format("ddd, MMM D, YYYY");
  }
};

/**
 * Steps through days, weeks or months, or picks one from a calendar.
 * Calls onChange with the first day of the new period.
 */
const DateNavigator = ({ date, unit, onChange }) => {
  const [anchor, setAnchor] = useState(null);
  const startOf = START_OF[unit];
  const go = (newDate) => onChange(moment(newDate).startOf(startOf));
  const isCurrent = moment(date).isSame(moment(), startOf);

  return (
    <Paper
      variant="outlined"
      sx={{ display: "flex", alignItems: "center", gap: 0.5, p: 0.5 }}
    >
      <Tooltip title={`Previous ${unit}`}>
        <IconButton
          size="small"
          aria-label={`Previous ${unit}`}
          onClick={() => go(moment(date).subtract(1, unit))}
        >
          <ChevronLeftRounded />
        </IconButton>
      </Tooltip>
      <Button
        color="inherit"
        endIcon={<ExpandMoreRounded />}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ minWidth: { sm: 190 }, fontWeight: 600 }}
      >
        {formatPeriod(date, unit)}
      </Button>
      <Tooltip title={`Next ${unit}`}>
        <IconButton
          size="small"
          aria-label={`Next ${unit}`}
          onClick={() => go(moment(date).add(1, unit))}
        >
          <ChevronRightRounded />
        </IconButton>
      </Tooltip>
      <Box
        sx={{ width: "1px", alignSelf: "stretch", bgcolor: "divider", mx: 0.5 }}
      />
      <Button
        size="small"
        disabled={isCurrent}
        onClick={() => go(moment())}
        sx={{ whiteSpace: "nowrap" }}
      >
        {unit === "day" ? "Today" : `This ${unit}`}
      </Button>
      <Popover
        open={anchor !== null}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <DateCalendar
          value={moment(date)}
          views={unit === "month" ? ["year", "month"] : ["year", "day"]}
          openTo={unit === "month" ? "month" : "day"}
          displayWeekNumber={unit === "week"}
          onChange={(value, selectionState) => {
            // with views of a year, only a final pick closes the calendar
            if (selectionState !== "partial") {
              setAnchor(null);
              go(value);
            }
          }}
        />
      </Popover>
    </Paper>
  );
};

DateNavigator.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
  ]).isRequired,
  unit: PropTypes.oneOf(["day", "week", "month"]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateNavigator;
