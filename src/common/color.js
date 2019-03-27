import _ from "lodash";
import hexToRgba from "hex-to-rgba";
import { pad } from "./date";

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

const calcStreak = (year, m, rowData, startIndex) => {
  let i = startIndex;
  let streak = 0;
  while (i >= 0) {
    const month = pad(m.toString());
    const day = pad(i.toString());
    const key = `${year}-${month}-${day}`;

    if (_.has(rowData, key)) {
      streak += 1;
      i -= 1;
    } else {
      return streak;
    }
  }

  return streak;
};

export const createColor = (
  colorMapping,
  year,
  month,
  rowData,
  columnIndex
) => {
  const streak = calcStreak(rowData, year, month, columnIndex);
  const alpha = 0.4 + streak / 10;
  if (colorMapping && colorMapping[rowData.meterName]) {
    return hexToRgba(colorMapping[rowData.meterName], alpha);
  }
  return "#fff";
};

export const getProgressColor = (progressEntry, alpha) => {
  if (progressEntry) {
    const { progress } = progressEntry;
    if (progress >= 0.5 && progress < 1) {
      return `rgba(247, 247, 183, ${alpha})`;
    } else if (progress >= 1) {
      return `rgba(144, 238, 144, ${alpha})`;
    }
  }
  return null;
};
