import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Tooltip from "@mui/material/Tooltip";
import { alpha } from "@mui/material/styles";
import { formatValue, isEmptyValue } from "../../common/meterTypes";
import { isDailyGoalReached } from "../../common/goals";
import { DEFAULT_METER_COLOR } from "../common/MeterAvatar";
import EntryValue from "./EntryValue";

/**
 * The entry of a meter on a day, shaded in the meter's color by its
 * intensity, opening an editor for it on click. Without a size, it fills
 * the width it is given as a square.
 */
const EntryCell = React.memo(function EntryCell({
  meter,
  date,
  entry,
  intensity,
  size,
  label,
  onEdit,
}) {
  const color = meter.color || DEFAULT_METER_COLOR;
  const hasValue = !!entry && !isEmptyValue(entry.value);
  // tables mark today in their header, calendars on the day
  const isToday = label !== undefined && moment(date).isSame(moment(), "day");
  const goalReached = isDailyGoalReached(meter, entry);
  const shade = hasValue ? 0.14 + 0.66 * intensity : 0;
  return (
    <Tooltip
      title={hasValue ? formatValue(meter, entry.value) : ""}
      disableInteractive
    >
      <ButtonBase
        aria-label={`${meter.name}, ${moment(date).format("ddd, MMM D")}`}
        onClick={(event) => onEdit(event.currentTarget, meter, date)}
        sx={(theme) => ({
          width: size || "100%",
          height: size,
          aspectRatio: size ? undefined : "1",
          position: "relative",
          borderRadius: 1.5,
          // dark shades need light content
          color: shade > 0.5 ? "#fff" : color,
          bgcolor: hasValue ? alpha(color, shade) : "transparent",
          border: hasValue ? 0 : `1px dashed ${theme.palette.divider}`,
          boxShadow: goalReached
            ? `inset 0 0 0 2px ${theme.palette.success.main}`
            : isToday
            ? `inset 0 0 0 2px ${theme.palette.primary.main}`
            : undefined,
          transition: theme.transitions.create("background-color"),
          "&:hover": {
            bgcolor: hasValue
              ? alpha(color, Math.min(1, shade + 0.12))
              : theme.palette.action.hover,
          },
        })}
      >
        {label !== undefined && (
          <Box
            component="span"
            sx={{
              position: "absolute",
              top: 3,
              left: 5,
              fontSize: "0.625rem",
              fontWeight: 600,
              lineHeight: 1,
              color: hasValue ? "inherit" : "text.secondary",
            }}
          >
            {label}
          </Box>
        )}
        <EntryValue meter={meter} value={entry && entry.value} />
      </ButtonBase>
    </Tooltip>
  );
});

EntryCell.propTypes = {
  meter: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  entry: PropTypes.object,
  intensity: PropTypes.number,
  size: PropTypes.number,
  // shown in a corner, e.g. the day of the month
  label: PropTypes.node,
  onEdit: PropTypes.func.isRequired,
};

export default EntryCell;
