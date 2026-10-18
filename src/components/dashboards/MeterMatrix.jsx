import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { goalProgress } from "../../common/goals";
import { entryIntensity, intensityScale } from "../../common/intensity";
import MeterAvatar from "../common/MeterAvatar";
import GoalChips from "../common/GoalChips";
import EntryCell from "../entries/EntryCell";
import useEntryPopover from "../entries/useEntryPopover";

const toDateString = (day) => moment(day).format("YYYY-MM-DD");

const CELL_SIZE = 32;

// the first column stays visible while scrolling through the days
const stickySx = {
  position: "sticky",
  left: 0,
  zIndex: 1,
  bgcolor: "background.paper",
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

/** The entries of all meters in a week, one row per meter. */
const MeterMatrix = ({ meters, days, entriesByMeter }) => {
  const { openEditor, popover } = useEntryPopover(meters, entriesByMeter);
  const progressByMeter = meters.map((meter) =>
    goalProgress(meter, entriesByMeter[meter.id], days)
  );
  const hasGoals = progressByMeter.some((progress) => progress.length > 0);

  return (
    <Card>
      <TableContainer>
        <Table size="small" sx={{ "& td, & th": { px: 0.5 } }}>
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
              {hasGoals && <TableCell>Goals</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {meters.map((meter, i) => {
              const entries = entriesByMeter[meter.id] || [];
              const progress = progressByMeter[i];
              const scale = intensityScale(meter, entries);
              return (
                <TableRow key={meter.id} hover>
                  <TableCell sx={{ ...stickySx, pl: "16px !important" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 150,
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
                    const entry = entries.find((e) => e.date === date);
                    return (
                      <TableCell key={date} align="center">
                        <EntryCell
                          meter={meter}
                          date={date}
                          entry={entry}
                          intensity={entryIntensity(
                            meter,
                            entry && entry.value,
                            scale
                          )}
                          size={CELL_SIZE}
                          onEdit={openEditor}
                        />
                      </TableCell>
                    );
                  })}
                  {hasGoals && (
                    <TableCell sx={{ pr: "16px !important" }}>
                      <GoalChips progress={progress} direction="column" />
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {popover}
    </Card>
  );
};

MeterMatrix.propTypes = {
  meters: PropTypes.arrayOf(PropTypes.object).isRequired,
  days: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  entriesByMeter: PropTypes.object.isRequired,
};

export default MeterMatrix;
