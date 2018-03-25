import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import withStyles from "@material-ui/core/styles/withStyles";
import SettingsIcon from "@material-ui/icons/MoreVert";
import { meterTitle, underline } from "../../../common/styles";
import MeterSettingsDialog from "./MeterSettingsDialog";

const styles = {
  underline,
  meterTitle
};

class TitleBar extends React.Component {
  state = {
    openSettings: false
  };

  handleClose = () => {
    this.setState({ openSettings: false });
  };

  render() {
    const { classes, meter, icon } = this.props;

    const SettingsButton = () => (
      <IconButton
        aria-label="Settings"
        style={{ float: "right" }}
        onClick={() => this.setState({ openSettings: true })}
      >
        <SettingsIcon style={{ fontSize: 20 }} />
      </IconButton>
    );

    return (
      <React.Fragment>
        <div
          style={{
            minHeight: 44
          }}
        >
          <Grid container alignItems="center">
            <Grid item xs={2}>
              {icon && (
                <span
                  style={{
                    paddingRight: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end"
                  }}
                >
                  {icon}
                </span>
              )}
            </Grid>
            <Grid item xs={8}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <span
                  key={`${meter.name}-title`}
                  variant="display1"
                  className={classes.meterTitle}
                >
                  {meter.name}
                </span>
              </div>
            </Grid>
            <Grid item xs={2}>
              <SettingsButton />
            </Grid>
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
  icon: PropTypes.node
};

TitleBar.defaultProps = {
  icon: null
};

export default withStyles(styles)(TitleBar);
