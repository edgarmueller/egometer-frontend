import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import {
  ActivityIcon,
  activityLabel,
  meterType,
} from "../../common/meterTypes";
import { DEFAULT_METER_COLOR } from "../common/MeterAvatar";

const colorOf = (meter) => meter.color || DEFAULT_METER_COLOR;

/** Picks one of the values of a mood or quantity meter. */
export const ChoiceInput = ({ meter, value, onChange }) => {
  const { values, valueLabels, valueIcons } = meterType(meter);
  const color = colorOf(meter);
  return (
    <ToggleButtonGroup
      exclusive
      fullWidth
      value={value === undefined ? null : value}
      // selecting the current value again clears it
      onChange={(event, newValue) => onChange(newValue)}
      aria-label={meter.name}
    >
      {values.map((v) => {
        const Icon = valueIcons[v];
        return (
          <ToggleButton
            key={v}
            value={v}
            aria-label={valueLabels[v]}
            sx={{
              flexDirection: "column",
              gap: 0.5,
              py: 1,
              "&.Mui-selected, &.Mui-selected:hover": {
                color,
                bgcolor: alpha(color, 0.12),
              },
            }}
          >
            <Icon />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {valueLabels[v]}
            </Typography>
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};

/** Toggles the tags of an activities meter. */
export const ActivitiesInput = ({ meter, value, onChange }) => {
  const selected = value || [];
  // tags removed from the meter stay on the days already tagged with them
  const tags = (meter.options || []).concat(
    selected.filter((tag) => !(meter.options || []).includes(tag))
  );
  const color = colorOf(meter);
  const toggle = (tag) =>
    onChange(
      selected.includes(tag)
        ? selected.filter((t) => t !== tag)
        : selected.concat([tag])
    );
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {tags.map((tag) => {
        const isSelected = selected.includes(tag);
        return (
          <Chip
            key={tag}
            icon={<ActivityIcon tag={tag} />}
            label={activityLabel(tag)}
            variant={isSelected ? "filled" : "outlined"}
            aria-pressed={isSelected}
            onClick={() => toggle(tag)}
            sx={
              isSelected
                ? {
                    color: "#fff",
                    bgcolor: color,
                    "& .MuiChip-icon": { color: "inherit" },
                    "&:hover": { bgcolor: alpha(color, 0.85) },
                  }
                : undefined
            }
          />
        );
      })}
    </Box>
  );
};

export const BooleanInput = ({ meter, value, onChange }) => (
  <FormControlLabel
    control={
      <Switch
        checked={!!value}
        onChange={(event) => onChange(event.target.checked)}
        slotProps={{ input: { "aria-label": meter.name } }}
      />
    }
    label={value ? "Yes" : "No"}
  />
);

const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

/** Edits a number, keeping what is typed until it is a valid number. */
export const NumberInput = ({ meter, value, onChange }) => {
  const [text, setText] = useState(
    value === undefined || value === null ? "" : String(value)
  );
  const goalReached =
    meter.dailyGoal > 0 && isNumeric(text) && Number(text) >= meter.dailyGoal;
  return (
    <TextField
      type="number"
      size="small"
      value={text}
      onChange={(event) => {
        const newText = event.target.value;
        setText(newText);
        if (newText === "") {
          onChange(undefined);
        } else if (isNumeric(newText)) {
          onChange(Number(newText));
        }
      }}
      helperText={meter.dailyGoal ? `Daily goal: ${meter.dailyGoal}` : " "}
      slotProps={{
        htmlInput: { "aria-label": meter.name, step: "any" },
        input: {
          endAdornment: goalReached && (
            <InputAdornment position="end">
              <CheckCircleRounded color="success" titleAccess="Goal reached" />
            </InputAdornment>
          ),
        },
      }}
      sx={{ maxWidth: 240 }}
      fullWidth
    />
  );
};

/** Edits a note, keeping what is typed even while it is saved. */
export const TextInput = ({ meter, value, onChange, autoFocus }) => {
  const [text, setText] = useState(value || "");
  return (
    <TextField
      multiline
      minRows={3}
      maxRows={12}
      placeholder="Write something about the day…"
      value={text}
      autoFocus={autoFocus}
      onChange={(event) => {
        setText(event.target.value);
        onChange(event.target.value.trim() ? event.target.value : undefined);
      }}
      slotProps={{ htmlInput: { "aria-label": meter.name } }}
      fullWidth
    />
  );
};

const INPUTS = {
  mood: ChoiceInput,
  quantity: ChoiceInput,
  activities: ActivitiesInput,
  boolean: BooleanInput,
  number: NumberInput,
  text: TextInput,
};

// inputs whose changes are saved after a pause in typing
export const isTyped = (meter) => ["number", "text"].includes(meter.type);

/**
 * Edits the value of an entry of a meter. Calls onChange with the new value,
 * or undefined if the entry should be removed.
 */
const EntryInput = (props) => {
  const Input = INPUTS[props.meter.type];
  return Input ? <Input {...props} /> : null;
};

const inputPropTypes = {
  meter: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
    color: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    dailyGoal: PropTypes.number,
  }).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
};

[
  EntryInput,
  ChoiceInput,
  ActivitiesInput,
  BooleanInput,
  NumberInput,
  TextInput,
].forEach((Input) => {
  Input.propTypes = inputPropTypes;
});

export default EntryInput;
