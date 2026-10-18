import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import CloseRounded from "@mui/icons-material/CloseRounded";
import TimesPerWeekSelect from "../common/TimesPerWeekSelect";
import { ActivityIcon, activityLabel } from "../../common/meterTypes";

// limits of the API
export const MAX_ACTIVITY_LENGTH = 50;
export const MAX_ACTIVITIES = 100;

/** Validates a new activity, returning an error message or undefined. */
export const validateActivity = (activity, activities) => {
  if (activity.length > MAX_ACTIVITY_LENGTH) {
    return `Activities can have at most ${MAX_ACTIVITY_LENGTH} characters`;
  }
  const lowerCase = activity.toLowerCase();
  if (activities.some((t) => t.toLowerCase() === lowerCase)) {
    return "This activity already exists";
  }
  if (activities.length >= MAX_ACTIVITIES) {
    return `A meter can have at most ${MAX_ACTIVITIES} activities`;
  }
  return undefined;
};

// a stable default, as the dialog resets when its goals change
const NO_GOALS = [];

/** Edits the activities of an activities meter and their goals. */
const ActivitiesDialog = ({
  open,
  meterName,
  activities,
  goals = NO_GOALS,
  onSave,
  onClose,
}) => {
  const [editedActivities, setEditedActivities] = useState(activities);
  // days a week by activity
  const [editedGoals, setEditedGoals] = useState({});
  const [newActivity, setNewActivity] = useState("");
  useEffect(() => {
    if (open) {
      setEditedActivities(activities);
      setEditedGoals(
        Object.fromEntries(goals.map((g) => [g.activity, g.timesPerWeek]))
      );
      setNewActivity("");
    }
  }, [open, activities, goals]);

  const trimmed = newActivity.trim();
  const error = trimmed
    ? validateActivity(trimmed, editedActivities)
    : undefined;
  const addActivity = (event) => {
    event.preventDefault();
    if (trimmed && !error) {
      setEditedActivities(editedActivities.concat([trimmed]));
      setNewActivity("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="activities-dialog-title"
    >
      <DialogTitle id="activities-dialog-title">
        Activities and goals of {meterName}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Set how often a week you want to do each activity. Removing an
          activity keeps it on the days you already did it.
        </DialogContentText>
        <List dense sx={{ mt: 1 }}>
          {editedActivities.map((activity) => (
            <ListItem
              key={activity}
              disableGutters
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label={`Remove ${activityLabel(activity)}`}
                  // at least one activity is required
                  disabled={editedActivities.length <= 1}
                  onClick={() =>
                    setEditedActivities(
                      editedActivities.filter((t) => t !== activity)
                    )
                  }
                >
                  <CloseRounded />
                </IconButton>
              }
              sx={{ pr: 6 }}
            >
              <ListItemIcon>
                <ActivityIcon tag={activity} />
              </ListItemIcon>
              <ListItemText primary={activityLabel(activity)} />
              <TimesPerWeekSelect
                ariaLabel={`Goal for ${activityLabel(activity)}`}
                value={editedGoals[activity]}
                onChange={(times) =>
                  setEditedGoals({ ...editedGoals, [activity]: times })
                }
              />
            </ListItem>
          ))}
        </List>
        <Box
          component="form"
          onSubmit={addActivity}
          sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 2 }}
        >
          <TextField
            size="small"
            label="New activity"
            value={newActivity}
            onChange={(event) => setNewActivity(event.target.value)}
            error={error !== undefined}
            helperText={error}
            fullWidth
          />
          <Button
            type="submit"
            variant="outlined"
            disabled={!trimmed || error !== undefined}
            sx={{ height: 40 }}
          >
            Add
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            onSave(
              editedActivities,
              editedActivities
                .filter((activity) => editedGoals[activity] > 0)
                .map((activity) => ({
                  activity,
                  timesPerWeek: editedGoals[activity],
                }))
            );
            onClose();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ActivitiesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  meterName: PropTypes.string,
  activities: PropTypes.arrayOf(PropTypes.string).isRequired,
  goals: PropTypes.arrayOf(
    PropTypes.shape({
      activity: PropTypes.string,
      timesPerWeek: PropTypes.number,
    })
  ),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ActivitiesDialog;
