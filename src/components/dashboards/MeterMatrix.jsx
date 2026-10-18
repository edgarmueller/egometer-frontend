import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Popover from "@mui/material/Popover";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { formatValue, isEmptyValue } from "../../common/meterTypes";
import { goalProgress, isDailyGoalReached } from "../../common/goals";
import MeterAvatar, { DEFAULT_METER_COLOR } from "../common/MeterAvatar";
import EntryEditor from "../entries/EntryEditor";
import EntryValue from "../entries/EntryValue";

const toDateString = (day) => moment(day).format("YYYY-MM-DD");

// a month needs smaller cells than a week to fit
const cellSize = (days) => (days.length > 7 ? 26 : 32);

// the first column stays visible while scrolling through the days
const stickySx = {
  position: "sticky",
  left: 0,
  zIndex: 1,
  bgcolor: "background.paper",
};

/** The entry of a meter on a day, opening an editor for it on click. */
export const MatrixCell = React.memo(function MatrixCell({
  meter,
  date,
  entry,
  size,
  onEdit,
}) {
  const color = meter.color || DEFAULT_METER_COLOR;
  const hasValue = !!entry && !isEmptyValue(entry.value);
  const goalReached = isDailyGoalReached(meter, entry);
  const label = `${meter.name}, ${moment(date).format("ddd, MMM D")}`;
  return (
    <Tooltip
      title={hasValue ? formatValue(meter, entry.value) : ""}
      disableInteractive
    >
      <ButtonBase
        aria-label={label}
        onClick={(event) => onEdit(event.currentTarget, meter, date, entry)}
        sx={(theme) => ({
          width: size,
          height: size,
          borderRadius: 1.5,
          color: goalReached ? theme.palette.success.dark : color,
          bgcolor: goalReached
            ? alpha(theme.palette.success.main, 0.18)
            : hasValue
            ? alpha(color, 0.16)
            : "transparent",
          border: hasValue ? 0 : `1px dashed ${theme.palette.divider}`,
          transition: theme.transitions.create("background-color"),
          "&:hover": {
            bgcolor: hasValue ? alpha(color, 0.28) : theme.palette.action.hover,
          },
        })}
      >
        <EntryValue meter={meter} value={entry && entry.value} />
      </ButtonBase>
    </Tooltip>
  );
});

MatrixCell.propTypes = {
  meter: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  entry: PropTypes.object,
  size: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
};

const DayHeader = ({ day }) => {
  const isToday = moment(day).isSame(moment(), "day");
  const isWeekend = [0, 6].includes(day.getDay());
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: isWeekend ? "text.disabled" : "text.secondary",
      }}
    >
      <span>{moment(day).format("dd")}</span>
      <Box
        component="span"
        sx={{
          mt: 0.5,
          width: 24,
          height: 24,
          lineHeight: "24px",
          borderRadius: "50%",
          textTransform: "none",
          ...(isToday && { color: "#fff", bgcolor: "primary.main" }),
        }}
      >
        {day.getDate()}
      </Box>
    </Box>
  );
};

DayHeader.propTypes = {
  day: PropTypes.instanceOf(Date).isRequired,
};

/** The entries of all meters on the given days, one row per meter. */
const MeterMatrix = ({ meters, days, entriesByMeter }) => {
  // the cell whose entry is being edited
  const [edited, setEdited] = useState(undefined);
  const openEditor = React.useCallback(
    (anchor, meter, date) => setEdited({ anchor, meterId: meter.id, date }),
    []
  );
  const progressByMeter = meters.map((meter) =>
    goalProgress(meter, entriesByMeter[meter.id], days)
  );
  const size = cellSize(days);
  const hasGoals = progressByMeter.some((progress) => progress !== undefined);

  const editedMeter = edited && meters.find((m) => m.id === edited.meterId);
  const editedEntry =
    editedMeter &&
    (entriesByMeter[editedMeter.id] || []).find((e) => e.date === edited.date);

  return (
    <Card>
      <TableContainer>
        <Table
          size="small"
          sx={{ "& td, & th": { px: days.length > 7 ? 0.25 : 0.5 } }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...stickySx, pl: "16px !important" }}>
                Meter
              </TableCell>
              {days.map((day) => (
                <TableCell key={day.toISOString()} align="center">
                  <DayHeader day={day} />
                </TableCell>
              ))}
              {hasGoals && <TableCell align="center">Goal</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {meters.map((meter, i) => {
              const entries = entriesByMeter[meter.id] || [];
              const progress = progressByMeter[i];
              return (
                <TableRow key={meter.id} hover>
                  <TableCell sx={{ ...stickySx, pl: "16px !important" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: days.length > 7 ? 120 : 150,
                        maxWidth: 220,
                      }}
                    >
                      <MeterAvatar meter={meter} size={28} />
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ fontWeight: 600 }}
                      >
                        {meter.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  {days.map((day) => {
                    const date = toDateString(day);
                    return (
                      <TableCell key={date} align="center">
                        <MatrixCell
                          meter={meter}
                          date={date}
                          entry={entries.find((e) => e.date === date)}
                          size={size}
                          onEdit={openEditor}
                        />
                      </TableCell>
                    );
                  })}
                  {hasGoals && (
                    <TableCell align="center">
                      {progress && (
                        <Chip
                          size="small"
                          label={`${progress.reached} / ${progress.target}`}
                          color={
                            progress.reached >= progress.target
                              ? "success"
                              : "default"
                          }
                        />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Popover
        open={editedMeter !== undefined}
        anchorEl={edited && edited.anchor}
        onClose={() => setEdited(undefined)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {editedMeter && (
          <Box sx={{ p: 2, width: { xs: 300, sm: 380 } }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <MeterAvatar meter={editedMeter} size={32} />
              <Box>
                <Typography variant="subtitle2">{editedMeter.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {moment(edited.date).format("dddd, MMMM D")}
                </Typography>
              </Box>
            </Box>
            <EntryEditor
              meter={editedMeter}
              date={edited.date}
              entry={editedEntry}
              autoFocus
            />
          </Box>
        )}
      </Popover>
    </Card>
  );
};

MeterMatrix.propTypes = {
  meters: PropTypes.arrayOf(PropTypes.object).isRequired,
  days: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  entriesByMeter: PropTypes.object.isRequired,
};

export default MeterMatrix;
