import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import { Emoji } from "emoji-mart";
import { meterTitle, underline } from "../../../common/styles";
import MeterSettingsDialog from "./MeterSettingsDialog";

const styles = {
  underline,
  meterTitle,
  meterTitleContainer: {
    display: "flex",
  },
  settingsButton: {
    float: "right",
  },
  settingsIcon: {
    fontSize: 20,
  },
  icon: {
    paddingRight: 10,
    display: "flex",
  },
  container: {
    minHeight: 44,
  },
};

class TitleBar extends React.PureComponent {
  state = {
    openSettings: false,
  };

  handleClose = () => {
    this.setState({ openSettings: false });
  };

  handleOpen = () => {
    this.setState({ openSettings: true });
  };

  render() {
    const { classes, meter, icon } = this.props;

    return (
      <React.Fragment>
        <div className={classes.container}>
          <Grid container alignItems="center">
            {/*
            <Grid item xs={1}>
              <DragHandle className="drag-handle" />
            </Grid>
            */}
            <Grid item xs={2}>
              {icon && (
                <span className={classes.icon}>
                  <Emoji emoji={icon} size={24} set="emojione" />
                </span>
              )}
            </Grid>
            <Grid item xs={10}>
              <div className={classes.meterTitleContainer}>
                <span
                  key={`${meter.name}-title`}
                  variant="display1"
                  className={classes.meterTitle}
                >
                  {meter.name}
                </span>
              </div>
            </Grid>
            {/*
            <Grid item xs={2}>
              <IconButton
                aria-label="Settings"
                className={classes.settingsButton}
                onClick={this.handleOpen}
              >
                <SettingsIcon className={classes.settingsIcon} />
              </IconButton>
            </Grid>
            */}
          </Grid>
        </div>
        <div
          className={classes.underline}
          style={{ backgroundColor: meter.color }}
        />
        <MeterSettingsDialog
          key={meter.name}
          open={this.state.openSettings}
          handleClose={this.handleClose}
          meter={meter}
        />
      </React.Fragment>
    );
  }
}

TitleBar.propTypes = {
  classes: PropTypes.object.isRequired,
  meter: PropTypes.object.isRequired,
  icon: PropTypes.node,
};

TitleBar.defaultProps = {
  icon: null,
};

export default withStyles(styles)(TitleBar);
