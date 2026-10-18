import React, { Suspense, lazy } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Loading from "../common/Loading";

// the picker and its emojis are only loaded once it is opened
const EmojiPicker = lazy(() => import("emoji-picker-react"));

/** Picks an emoji as the icon of a meter. */
const IconPicker = ({ open, meterName, hasIcon, onPick, onClose }) => (
  <Dialog open={open} onClose={onClose} aria-labelledby="icon-picker-title">
    <DialogTitle id="icon-picker-title">Icon of {meterName}</DialogTitle>
    <DialogContent sx={{ px: { xs: 1, sm: 3 } }}>
      <Suspense fallback={<Loading />}>
        <EmojiPicker
          emojiStyle="native"
          skinTonesDisabled
          previewConfig={{ showPreview: false }}
          width="100%"
          height={400}
          onEmojiClick={({ emoji }) => onPick(emoji)}
        />
      </Suspense>
    </DialogContent>
    <DialogActions>
      {hasIcon && (
        <Button color="error" onClick={() => onPick(null)}>
          Remove icon
        </Button>
      )}
      <Button onClick={onClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

IconPicker.propTypes = {
  open: PropTypes.bool.isRequired,
  meterName: PropTypes.string,
  hasIcon: PropTypes.bool,
  onPick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default IconPicker;
