import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { RESET_ENTRIES_ERROR } from "../../actions";

const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark,
    opacity: 0.9
  },
  icon: {
    fontSize: 20
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap"
  }
});

const ClientSnackbar = props => {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = ErrorIcon;

  return (
    <SnackbarContent
      className={classes.error}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={[classes.icon, classes.iconVariant].join(" ")} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
};
const StyledSnackbar = withStyles(styles)(ClientSnackbar);

export const ErrorSnackbar = ({ error, resetError }) => {
  const hasError = error && error.message;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      open={hasError}
      autoHideDuration={2000}
      onClose={() => {
        resetError();
      }}
    >
      <StyledSnackbar onClose={() => resetError()}
        variant="error"
        message={hasError && error.message}
      />
    </Snackbar>
  );
};

ErrorSnackbar.propTypes = {
  error: PropTypes.object,
  resetError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  error: _.get(state, "entries.error")
});

const mapDispatchToProps = dispatch => ({
  resetError() {
    dispatch({
      type: RESET_ENTRIES_ERROR
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorSnackbar);
