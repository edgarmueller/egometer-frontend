import React from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import { alpha } from "@mui/material/styles";
import { meterType } from "../../common/meterTypes";

export const DEFAULT_METER_COLOR = "#4f46e5";

// icons used to be emoji-mart ids like "smile", only emojis are shown
const isEmoji = (icon) => !!icon && !/^[\w+-]+$/.test(icon);

/** A meter's emoji, or the icon of its type, on a tint of its color. */
const MeterAvatar = ({ meter, size = 36 }) => {
  const color = meter.color || DEFAULT_METER_COLOR;
  const { Icon } = meterType(meter) || {};
  return (
    <Avatar
      variant="rounded"
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.55,
        color,
        bgcolor: alpha(color, 0.14),
        borderRadius: 2,
      }}
    >
      {isEmoji(meter.icon)
        ? meter.icon
        : Icon && <Icon sx={{ fontSize: size * 0.6 }} />}
    </Avatar>
  );
};

MeterAvatar.propTypes = {
  meter: PropTypes.shape({
    type: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.string,
  }).isRequired,
  size: PropTypes.number,
};

export default MeterAvatar;
