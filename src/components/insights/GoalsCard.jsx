import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import FlagRounded from "@mui/icons-material/FlagRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import { goalHistory, meterGoals } from "../../common/goals";
import EmptyState from "../common/EmptyState";
import MeterAvatar, { DEFAULT_METER_COLOR } from "../common/MeterAvatar";
import { formatTimesPerWeek } from "../common/TimesPerWeekSelect";

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

const GoalRow = ({ meter, goal, history }) => {
  const color = meter.color || DEFAULT_METER_COLOR;
  const done = history.thisWeek >= goal.timesPerWeek;
  return (
    <Box
      component="li"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr auto", md: "minmax(0, 2fr) 3fr auto" },
        alignItems: "center",
        columnGap: 3,
        rowGap: 1,
        py: 1.5,
        borderTop: 1,
        borderColor: "divider",
        "&:first-of-type": { borderTop: 0 },
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}
      >
        <MeterAvatar meter={meter} size={32} />
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontWeight: 600 }}>
            {goal.label || meter.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {goal.label ? `${meter.name} · ` : ""}
            {formatTimesPerWeek(goal.timesPerWeek)}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          gridRow: { xs: 2, md: "auto" },
          gridColumn: { xs: "1 / -1", md: "auto" },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            This week
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: done ? "success.main" : "text.primary",
            }}
          >
            {history.thisWeek} / {goal.timesPerWeek}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={Math.min(100, (history.thisWeek / goal.timesPerWeek) * 100)}
          aria-label={`${goal.label || meter.name} this week`}
          sx={(theme) => ({
            height: 8,
            borderRadius: 4,
            bgcolor: alpha(color, 0.15),
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
              bgcolor: done ? theme.palette.success.main : color,
            },
          })}
        />
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 0.5,
            color: history.streak > 0 ? "warning.main" : "text.disabled",
          }}
        >
          <LocalFireDepartmentRounded fontSize="small" />
          <Typography sx={{ fontWeight: 700 }}>
            {plural(history.streak, "week")}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" noWrap>
          met {history.weeksMet} of {plural(history.weeks, "week")}
        </Typography>
      </Box>
    </Box>
  );
};

GoalRow.propTypes = {
  meter: PropTypes.object.isRequired,
  goal: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

/** How each weekly goal goes this week and went in the past weeks. */
const GoalsCard = ({ meters, entriesByMeter, from }) => {
  const goals = meters.flatMap((meter) =>
    meterGoals(meter).map((goal) => ({
      meter,
      goal,
      history: goalHistory(goal, entriesByMeter[meter.id], from),
    }))
  );
  return (
    <Card>
      <CardHeader
        title="Weekly goals"
        subheader={`Past weeks since ${moment(from)
          .startOf("isoWeek")
          .format("MMM D")}, and this week so far`}
      />
      <CardContent sx={{ pt: 1 }}>
        {goals.length === 0 ? (
          <EmptyState
            icon={<FlagRounded sx={{ fontSize: 40 }} />}
            title="No goals yet"
            action={
              <Button variant="outlined" component={Link} to="/meters">
                Set goals
              </Button>
            }
          >
            Set how often a week you want to meet a meter, like working out
            three times a week, on the Meters page.
          </EmptyState>
        ) : (
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
            {goals.map(({ meter, goal, history }) => (
              <GoalRow
                key={`${meter.id}-${goal.key}`}
                meter={meter}
                goal={goal}
                history={history}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

GoalsCard.propTypes = {
  meters: PropTypes.arrayOf(PropTypes.object).isRequired,
  entriesByMeter: PropTypes.object.isRequired,
  from: PropTypes.instanceOf(moment).isRequired,
};

export default GoalsCard;
