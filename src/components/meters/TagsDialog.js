import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { activityLabel } from "../../widgets/day/activities";

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

/** Edits the tags of an activities meter. */
const TagsDialog = ({ open, meterName, tags, onSave, onClose }) => {
  const [editedTags, setEditedTags] = useState(tags);
  const [newTag, setNewTag] = useState("");
  useEffect(() => {
    if (open) {
      setEditedTags(tags);
      setNewTag("");
    }
  }, [open, tags]);

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
    <Dialog open={open} onClose={onClose} aria-labelledby="tags-dialog-title">
      <DialogTitle id="tags-dialog-title">Tags of {meterName}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Removing a tag keeps it on the days already tagged with it.
        </DialogContentText>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {editedTags.map((tag) => (
            <Chip
              key={tag}
              label={activityLabel(tag)}
              style={{ margin: 4 }}
              onDelete={
                // at least one tag is required
                editedTags.length > 1
                  ? () => setEditedTags(editedTags.filter((t) => t !== tag))
                  : undefined
              }
            />
          ))}
        </div>
        <form onSubmit={addTag} style={{ display: "flex", marginTop: 16 }}>
          <TextField
            label="New tag"
            value={newTag}
            onChange={(event) => setNewTag(event.target.value)}
            error={error !== undefined}
            helperText={error}
            fullWidth
          />
          <Button type="submit" disabled={!trimmed || error !== undefined}>
            Add
          </Button>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="primary"
          onClick={() => {
            onSave(editedTags);
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
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TagsDialog;
