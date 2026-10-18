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
export const MAX_TAG_LENGTH = 50;
export const MAX_TAGS = 100;

/** Validates a new tag, returning an error message or undefined. */
export const validateTag = (tag, tags) => {
  if (tag.length > MAX_TAG_LENGTH) {
    return `Tags can have at most ${MAX_TAG_LENGTH} characters`;
  }
  const lowerCase = tag.toLowerCase();
  if (tags.some((t) => t.toLowerCase() === lowerCase)) {
    return "This tag already exists";
  }
  if (tags.length >= MAX_TAGS) {
    return `A meter can have at most ${MAX_TAGS} tags`;
  }
  return undefined;
};

// a stable default, as the dialog resets when its goals change
const NO_GOALS = [];

/** Edits the tags of an activities meter and their goals. */
const TagsDialog = ({
  open,
  meterName,
  tags,
  goals = NO_GOALS,
  onSave,
  onClose,
}) => {
  const [editedTags, setEditedTags] = useState(tags);
  // days a week by tag
  const [editedGoals, setEditedGoals] = useState({});
  const [newTag, setNewTag] = useState("");
  useEffect(() => {
    if (open) {
      setEditedTags(tags);
      setEditedGoals(
        Object.fromEntries(goals.map((g) => [g.tag, g.timesPerWeek]))
      );
      setNewTag("");
    }
  }, [open, tags, goals]);

  const trimmed = newTag.trim();
  const error = trimmed ? validateTag(trimmed, editedTags) : undefined;
  const addTag = (event) => {
    event.preventDefault();
    if (trimmed && !error) {
      setEditedTags(editedTags.concat([trimmed]));
      setNewTag("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="tags-dialog-title"
    >
      <DialogTitle id="tags-dialog-title">
        Tags and goals of {meterName}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Set how often a week you want to do an activity. Removing a tag keeps
          it on the days already tagged with it.
        </DialogContentText>
        <List dense sx={{ mt: 1 }}>
          {editedTags.map((tag) => (
            <ListItem
              key={tag}
              disableGutters
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label={`Remove ${activityLabel(tag)}`}
                  // at least one tag is required
                  disabled={editedTags.length <= 1}
                  onClick={() =>
                    setEditedTags(editedTags.filter((t) => t !== tag))
                  }
                >
                  <CloseRounded />
                </IconButton>
              }
              sx={{ pr: 6 }}
            >
              <ListItemIcon>
                <ActivityIcon tag={tag} />
              </ListItemIcon>
              <ListItemText primary={activityLabel(tag)} />
              <TimesPerWeekSelect
                ariaLabel={`Goal for ${activityLabel(tag)}`}
                value={editedGoals[tag]}
                onChange={(times) =>
                  setEditedGoals({ ...editedGoals, [tag]: times })
                }
              />
            </ListItem>
          ))}
        </List>
        <Box
          component="form"
          onSubmit={addTag}
          sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 2 }}
        >
          <TextField
            size="small"
            label="New tag"
            value={newTag}
            onChange={(event) => setNewTag(event.target.value)}
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
              editedTags,
              editedTags
                .filter((tag) => editedGoals[tag] > 0)
                .map((tag) => ({ tag, timesPerWeek: editedGoals[tag] }))
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

TagsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  meterName: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  goals: PropTypes.arrayOf(
    PropTypes.shape({ tag: PropTypes.string, timesPerWeek: PropTypes.number })
  ),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TagsDialog;
