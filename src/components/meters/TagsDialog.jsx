import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="tags-dialog-title"
    >
      <DialogTitle id="tags-dialog-title">Tags of {meterName}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Removing a tag keeps it on the days already tagged with it.
        </DialogContentText>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {editedTags.map((tag) => (
            <Chip
              key={tag}
              icon={<ActivityIcon tag={tag} />}
              label={activityLabel(tag)}
              variant="outlined"
              onDelete={
                // at least one tag is required
                editedTags.length > 1
                  ? () => setEditedTags(editedTags.filter((t) => t !== tag))
                  : undefined
              }
            />
          ))}
        </Box>
        <Box
          component="form"
          onSubmit={addTag}
          sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 3 }}
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
