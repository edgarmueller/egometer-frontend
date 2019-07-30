import React, { useState } from "react";
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
    maxWidth: 30,
    maxHeight: 30,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5em",
    "&:hover": {
      backgroundColor: "rgb(65, 102, 170, 0.5)",
      color: "#fff"
    }
  },
  dialogTitle: {
    padding: "10px"
  }
};

export const StringCell = ({
  classes,
  data,
  date,
  meterId,
  color,
  isLoading
}) => {
  const [open, setOpen] = useState(false);
  return (
    <ConnectedComponent
      shouldDebounce={true}
      data={data}
      date={date}
      meterId={meterId}
      isLoading={isLoading}
      updateOnChange={false}
    >
      {({ data: value, updateValue, reset, submitEntry }) => (
        <React.Fragment>
          <div
            className={classes.stringCell}
            style={{
              backgroundColor: color
            }}
            onClick={() => {
              if (open) {
                return;
              }
              setOpen(true);
            }}
          />
          <Dialog
            open={open}
            maxWidth="md"
            fullWidth
            onClose={() => setOpen(false)}
          >
            <DialogTitle>Add entry</DialogTitle>
            <DialogContent>
              <TextField
                multiline
                value={value}
                onChange={updateValue}
                rows={10}
                variant="outlined"
                fullWidth
                margin={"dense"}
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                onClick={() => {
                  submitEntry();
                  setOpen(false);
                }}
                color="primary"
                autoFocus
              >
                OK
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpen(false);
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
};

export default compose(withStyles(styles))(React.memo(StringCell));
