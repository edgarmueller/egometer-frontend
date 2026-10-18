import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { RESET_ENTRIES_ERROR } from "../../actions";

// errors in the store are strings, { message } objects or errors
export const errorMessage = (error) => {
  if (!error) {
    return undefined;
  }
  if (typeof error === "string") {
    return error;
  }
  return errorMessage(error.message);
};

export const ErrorSnackbar = ({ error, onClose }) => {
  const message = errorMessage(error);
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={message !== undefined}
      autoHideDuration={4000}
      onClose={onClose}
    >
      <Alert severity="error" variant="filled" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

ErrorSnackbar.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClose: PropTypes.func.isRequired,
};

/** Shows errors of loading or saving entries. */
export const EntriesErrorSnackbar = connect(
  (state) => ({ error: state.entries.error }),
  (dispatch) => ({
    onClose: () => dispatch({ type: RESET_ENTRIES_ERROR }),
  })
)(ErrorSnackbar);

export default ErrorSnackbar;
