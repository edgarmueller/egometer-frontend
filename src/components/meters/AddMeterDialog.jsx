import React, { useState } from "react";
import PropTypes from "prop-types";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { METER_TYPES } from "../../common/meterTypes";
import * as api from "../../api";

/** Creates a meter of one of the meter types. */
const AddMeterDialog = ({ open, color, onClose, onCreated }) => {
  const [error, setError] = useState(undefined);
  const [isCreating, setCreating] = useState(false);

  const create = async (type) => {
    setCreating(true);
    setError(undefined);
    try {
      await api.createMeter(type, METER_TYPES[type].label, color);
      onCreated();
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="add-meter-title"
    >
      <DialogTitle id="add-meter-title">Add a meter</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Pick what to track. You can rename the meter afterwards.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.5,
          }}
        >
          {Object.entries(METER_TYPES).map(
            ([type, { label, description, Icon }]) => (
              <ButtonBase
                key={type}
                aria-label={label}
                disabled={isCreating}
                onClick={() => create(type)}
                sx={(theme) => ({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1.5,
                  p: 1.5,
                  textAlign: "left",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  transition: theme.transitions.create([
                    "border-color",
                    "background-color",
                  ]),
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                })}
              >
                <Avatar
                  variant="rounded"
                  sx={(theme) => ({
                    color: "primary.main",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 2,
                  })}
                >
                  <Icon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">{label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </Box>
              </ButtonBase>
            )
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

AddMeterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  color: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func.isRequired,
};

export default AddMeterDialog;
