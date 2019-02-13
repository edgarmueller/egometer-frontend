import React from "react";
import { compose } from "recompose";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { deleteMeter, updateMeter } from "../../../actions";
import ColorPicker from "../../common/ColorPicker";
import { Grid } from "@material-ui/core";

const styles = {
  dialogPaper: {
    minHeight: "70vh",
    maxHeight: "70vh"
  },
  dialog: {
    minHeight: 300
  }
};

class MeterSettingsDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      color: props.meter.color,
      name: props.meter.name,
      confirmation: ""
    };
  }

  updateColor = color => {
    this.setState({ color });
  };

  updateName = event => {
    this.setState({ name: event.target.value });
  };

  updateConfirmation = event => {
    this.setState({ confirmation: event.target.value });
  };

  render() {
    const {
      open,
      classes,
      meter,
      handleClose,
      deleteMeter,
      updateMeter
    } = this.props;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-schema-title"
        aria-describedby="alert-schema-description"
      >
        <DialogTitle id="alert-schema-title">
          <strong>{meter.name} Meter Settings</strong>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={24} alignItems={"center"}>
            <Grid item xs={3}>
              Name
            </Grid>
            <Grid item xs={9}>
              <TextField
                margin="dense"
                variant="outlined"
                value={this.state.name}
                onChange={this.updateName}
              />
            </Grid>

            <Grid item xs={3}>
              Color
            </Grid>
            <Grid item xs={9}>
              <ColorPicker color={meter.color} onChange={this.updateColor} />
            </Grid>
            <Grid item xs={3}>
              Delete meter
            </Grid>
            <Grid item xs={9}>
              <TextField
                margin="dense"
                fullWidth
                placeholder={"Enter name of meter to confirm deletion"}
                variant="outlined"
                value={this.state.confirmation}
                onChange={this.updateConfirmation}
              />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={9}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  handleClose();
                  deleteMeter(meter.id);
                }}
                disabled={this.state.confirmation !== meter.name}
              >
                Delete this meter
              </Button>
            </Grid>
          </Grid>
          {this.state.error && (
            <p style={{ color: "red" }}>
              An error occurred while updating the meter. Please try again.
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              updateMeter({
                ...meter,
                name: this.state.name,
                color: this.state.color
              }).then(
                resp => {
                  handleClose();
                  this.setState({
                    color: "#cecece",
                    name: meter.name,
                    confirmation: ""
                  });
                },
                resp => this.setState({ error: resp.response.data.description })
              );
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default compose(
  withStyles(styles),
  connect(
    null,
    {
      deleteMeter,
      updateMeter
    }
  )
)(MeterSettingsDialog);
