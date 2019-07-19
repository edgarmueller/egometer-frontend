import hexToRgba from "hex-to-rgba";

// via https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
export function shadeColor2(color, percent) {
  const f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;

  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}

/**
 * Calculate a color based on the given color mapping and row data.
 *  
 * @param {*} colorMapping 
 * @param {*} rowData 
 */
export const createColor = (colorMapping, rowData) => {
  const alpha = 0.4;
  if (colorMapping && rowData.meter && colorMapping[rowData.meter.name]) {
    return hexToRgba(colorMapping[rowData.meter.name], alpha);
  }
  return "#fff";
};

export const createProgressSuccessColor = alpha =>
  `rgba(129, 199, 132, ${alpha})`;

export const getProgressColor = (progress, alpha) => {
  if (progress) {
    if (progress >= 0.5 && progress < 1) {
      return `rgba(244, 67, 54, ${alpha})`;
    } else if (progress >= 1) {
      return createProgressSuccessColor(alpha);
    }
    return `rgba(244, 67, 54, ${alpha})`;
  }
  return null;
};

export const green = "#81c784";
export const red = "#f44336";
