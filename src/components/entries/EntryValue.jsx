import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import CheckRounded from "@mui/icons-material/CheckRounded";
import NotesRounded from "@mui/icons-material/NotesRounded";
import { meterType } from "../../common/meterTypes";

/** A compact view of an entry's value, e.g. within a cell of a table. */
const EntryValue = ({ meter, value }) => {
  if (value === undefined || value === null) {
    return null;
  }
  const { valueIcons } = meterType(meter);
  if (valueIcons) {
    const Icon = valueIcons[value];
    return Icon ? <Icon fontSize="small" /> : null;
  }
  switch (meter.type) {
    case "boolean":
      return value ? <CheckRounded fontSize="small" /> : null;
    case "text":
      return <NotesRounded fontSize="small" />;
    case "activities":
    case "number":
      return (
        <Typography variant="caption" sx={{ fontWeight: 700 }} noWrap>
          {meter.type === "activities" ? value.length : value}
        </Typography>
      );
    default:
      return null;
  }
};

EntryValue.propTypes = {
  meter: PropTypes.shape({ type: PropTypes.string.isRequired }).isRequired,
  value: PropTypes.any,
};

export default EntryValue;
