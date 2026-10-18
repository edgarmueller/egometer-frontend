import React from "react";
import PropTypes from "prop-types";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export const formatTimesPerWeek = (times) =>
  times === 7 ? "Every day" : `${times}× a week`;

/** Picks how many days a week a goal asks for, or no goal. */
const TimesPerWeekSelect = ({ label, ariaLabel, value, onChange, sx }) => (
  <TextField
    select
    size="small"
    label={label}
    value={value || 0}
    onChange={(event) => onChange(Number(event.target.value) || null)}
    slotProps={{
      select: { SelectDisplayProps: { "aria-label": ariaLabel || label } },
    }}
    sx={{ width: 140, ...sx }}
  >
    <MenuItem value={0}>
      <em>No goal</em>
    </MenuItem>
    {OPTIONS.map((times) => (
      <MenuItem key={times} value={times}>
        {formatTimesPerWeek(times)}
      </MenuItem>
    ))}
  </TextField>
);

TimesPerWeekSelect.propTypes = {
  label: PropTypes.string,
  // for selects without a visible label
  ariaLabel: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  sx: PropTypes.object,
};

export default TimesPerWeekSelect;
