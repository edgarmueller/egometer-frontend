import * as React from "react";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Button from "@material-ui/core/Button/Button";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import TextField from "@material-ui/core/TextField";
import ConnectedComponent from "../../../components/common/ConnectedComponent";

const styles = {
  stringCell: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5em",
    fontWeight: 700
  },
  dialogTitle: {
    padding: "10px"
  }
};

export class StringCell extends React.Component {
  state = {
    open: false
  };

  render() {
    const {
      classes,
      data,
      date,
      meterId,
      updateEntry,
      color,
      isLoading
    } = this.props;

    return (
      <ConnectedComponent
        shouldDebounce={true}
        data={data}
        date={date}
        meterId={meterId}
        isLoading={isLoading}
        updateEntry={updateEntry}
        updateOnChange={false}
      >
        {({
          data: value,
          handleOnChange,
          reset,
          submitEntry
        }) => (
            <React.Fragment>
              <div
                className={classes.stringCell}
                style={{
                  backgroundColor: color
                }}
                onClick={() => {
                  if (this.state.open) {
                    return;
                  }
                  this.setState({ open: true });
                }}
              />
              <Dialog
                open={this.state.open}
                maxWidth='md'
                fullWidth
                onClose={() => {
                  this.setState({ open: false });
                }}
              >
                <DialogTitle>Add entry</DialogTitle>
                <DialogContent>
                  <TextField
                    multiline
                    value={value}
                    onChange={handleOnChange}
                    rows={10}
                    variant='outlined'
                    fullWidth
                    margin={'dense'}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      submitEntry();
                      this.setState({ open: false });
                    }}
                    color='primary'
                    autoFocus
                  >
                    OK
                </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      this.setState({ open: false });
                      reset();
                    }}
                  >
                    Close
                </Button>
                </DialogActions>
              </Dialog>
            </React.Fragment>
          )}
      </ConnectedComponent>
    );
  }
}

export default compose(withStyles(styles))(StringCell);
