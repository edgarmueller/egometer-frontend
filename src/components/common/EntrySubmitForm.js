import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { buttonStyle } from "../../common/styles";
import { updateEntryRequest } from "../../actions";
import { getMeters } from "../../reducers";

const styles = {
  button: buttonStyle
};

export class EntrySubmitForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined
    };
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const {
      error,
      toSchemaType,
      meterId,
      date,
      updateEntryRequest,
      onSubmit
    } = this.props;

    // TODO: meter schema should be made availble here
    // so that we can set input props accordingly
    const inputProps = { type: "text" };

    return (
      <div style={{ margin: 10 }}>
        <Typography variant="caption">
          Tip: Press the <code>TAB</code> key to focus the ENTER button, then
          press <code>Enter</code>
        </Typography>
        <TextField
          autoFocus
          InputProps={inputProps}
          onChange={ev =>
            this.setState({ value: toSchemaType(ev.target.value) })
          }
        />
        <Button
          variant="outlined"
          type="submit"
          style={{ margin: 10 }}
          onClick={() => {
            onSubmit();
            updateEntryRequest({
              meterId,
              date,
              value: this.state.value
            });
          }}
        >
          ENTER DATA
        </Button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  meters: getMeters(state),
  ...ownProps
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { updateEntryRequest }
  )
)(EntrySubmitForm);
