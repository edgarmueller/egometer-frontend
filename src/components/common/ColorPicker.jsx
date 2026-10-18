import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import CheckRounded from "@mui/icons-material/CheckRounded";

export const COLORS = [
  "#4f46e5",
  "#2563eb",
  "#0891b2",
  "#059669",
  "#65a30d",
  "#ca8a04",
  "#ea580c",
  "#dc2626",
  "#db2777",
  "#9333ea",
  "#475569",
  "#78716c",
];

const Swatch = ({ color, size, selected, ...props }) => (
  <ButtonBase
    aria-label={color}
    {...props}
    sx={{
      width: size,
      height: size,
      borderRadius: "50%",
      bgcolor: color,
      color: "#fff",
      boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.12)",
    }}
  >
    {selected && <CheckRounded fontSize="small" />}
  </ButtonBase>
);

Swatch.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  selected: PropTypes.bool,
};

/** A swatch of the color that opens a palette to pick another one. */
const ColorPicker = ({ color = COLORS[0], onChange }) => {
  const [anchor, setAnchor] = useState(null);
  const pick = (newColor) => {
    setAnchor(null);
    onChange(newColor);
  };
  return (
    <>
      <Swatch
        color={color}
        size={28}
        aria-label="Change color"
        onClick={(event) => setAnchor(event.currentTarget)}
      />
      <Popover
        open={anchor !== null}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, width: 232 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 1,
            }}
          >
            {COLORS.map((c) => (
              <Swatch
                key={c}
                color={c}
                size={28}
                selected={c.toLowerCase() === (color || "").toLowerCase()}
                onClick={() => pick(c)}
              />
            ))}
          </Box>
          <Box
            component="label"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
              cursor: "pointer",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Custom color
            </Typography>
            <Box
              component="input"
              type="color"
              value={color}
              onChange={(event) => pick(event.target.value)}
              sx={{
                width: 40,
                height: 28,
                border: 0,
                p: 0,
                bgcolor: "transparent",
              }}
            />
          </Box>
        </Box>
      </Popover>
    </>
  );
};

ColorPicker.propTypes = {
  color: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ColorPicker;
