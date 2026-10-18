import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FlagRounded from "@mui/icons-material/FlagRounded";

/** The progress of each goal of a meter, green once a goal is met. */
const GoalChips = ({ progress, direction = "row" }) =>
  progress.length === 0 ? null : (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction,
        flexWrap: "wrap",
        alignItems: direction === "row" ? "center" : "stretch",
        gap: 0.5,
      }}
    >
      {progress.map(({ key, label, reached, target }) => (
        <Chip
          key={key}
          size="small"
          icon={<FlagRounded />}
          label={`${label ? `${label} ` : ""}${reached} / ${target}`}
          color={reached >= target ? "success" : "default"}
          variant={reached >= target ? "filled" : "outlined"}
        />
      ))}
    </Box>
  );

GoalChips.propTypes = {
  progress: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
      reached: PropTypes.number.isRequired,
      target: PropTypes.number.isRequired,
    })
  ).isRequired,
  direction: PropTypes.oneOf(["row", "column"]),
};

export default GoalChips;
