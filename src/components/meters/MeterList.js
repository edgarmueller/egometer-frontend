import React, { useEffect, useCallback, useState, useReducer } from "react";
import toNumber from "lodash/toNumber";
import get from "lodash/get";
import { connect } from "react-redux";
import { compose } from "recompose";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { Emoji } from 'emoji-mart'
import {
  Switch,
  Dialog,
  DialogTitle,
  Button,
} from "@material-ui/core";
import ColorPicker from "../common/ColorPicker";
import { Picker } from 'emoji-mart'
import { deleteMeter, resetMetersError, updateMeter, updateMeterRequest } from "../../actions";
import { display1 } from "../../common/styles";
import {
  getMeters,
  isFetchingMeters,
  getMeterError,
  getSchemas
} from "../../reducers";
import { findBySchemaId } from "../../utils";
import { ErrorSnackbar } from "../common/ErrorSnackbar";

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  display1,
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "0 auto"
  },
  button: {
    margin: "0.25em",
    float: "right"
  },
  table: {
    width: 700,
    margin: "0 auto",
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
});

const isNumberSchema = schema => {
  return schema && schema.type === "number";
};

const metersById = meters => {
  return meters.reduce((acc, m) => {
    acc[m.id] = m;
    return acc;
  }, {});
};

const UPDATE_ALL = "UPDATE_ALL";
const UPDATE_SINGLE = "UPDATE_SINGLE";

const updateLocalMeter = (state, meterId, propName, propValue) => {
  return {
    ...state,
    [meterId]: {
      ...state[meterId],
      [propName]: propValue
    }
  };
};

const localMeterReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_ALL:
      return action.payload;
    case UPDATE_SINGLE:
      return updateLocalMeter(
        state,
        action.id,
        action.propName,
        action.payload
      );
    default:
      return state;
  }
};

const valueOf = state => (meterId, propName) => {
  return get(state, [meterId + "", propName]) || "";
};

export const Meters = ({
  classes,
  deleteMeter,
  meters,
  updateMeterRequest,
  isFetchingMeters,
  schemas,
  meterError,
  resetMetersError
}) => {
  const [state, dispatch] = useReducer(localMeterReducer, {
    meterById: metersById(meters)
  });
  const [open, setOpen] = useState(false);
  const [editedMeter, setEditedMeter] = useState(undefined);
  const handleUpdateMeter = useCallback((meter, propName, propValue) => {
    dispatch({
      type: UPDATE_SINGLE,
      id: meter.id,
      propName,
      payload: propValue
    });
    updateMeterRequest({
      ...meter,
      [propName]: propValue
    });
  }, [updateMeterRequest]);

  const handleDeleteMeter = useCallback(meter => () => deleteMeter(meter.id), [deleteMeter]);
  useEffect(() => dispatch({ type: UPDATE_ALL, payload: metersById(meters) }), [
    meters
  ]);

  if (isFetchingMeters) {
    return <div>Loading meters</div>;
  }

  return (
    <div>
      <ErrorSnackbar
        error={meterError}
        resetError={resetMetersError}
      />
      <Typography variant="display1" className={classes.display1}>
        Manage Meters
      </Typography>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell />
              <TableCell />
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Daily Goal</TableCell>
              <TableCell>Weekly Goal</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Icon</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meters ? (
              meters.map(meter => {
                const schema = findBySchemaId(schemas, meter.schemaId);
                return (
                  <TableRow key={meter.id}>
                    <TableCell colSpan={3}>
                      <TextField
                        margin="dense"
                        variant="outlined"
                        value={valueOf(state)(meter.id, "name")}
                        onChange={ev =>
                          handleUpdateMeter(meter, "name", ev.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>{meter.widget}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="Delete meter"
                        onClick={handleDeleteMeter(meter)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      {isNumberSchema(schema) ? (
                        <TextField
                          value={valueOf(state)(meter.id, "dailyGoal")}
                          onChange={ev =>
                            handleUpdateMeter(
                              meter,
                              "dailyGoal",
                              toNumber(ev.target.value)
                            )
                          }
                        />
                      ) : (
                          <Switch
                            checked={valueOf(state)(meter.id, "dailyGoal") > 0}
                            onChange={(ev, goal) =>
                              handleUpdateMeter(meter, "dailyGoal", goal ? 1 : 0)
                            }
                          />
                        )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={valueOf(state)(meter.id, "weeklyGoal")}
                        onChange={ev =>
                          handleUpdateMeter(
                            meter,
                            "weeklyGoal",
                            Number(ev.target.value)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <ColorPicker
                        color={valueOf(state)(meter.id, "color")}
                        onChange={() => { }}
                        onChangeComplete={color =>
                          handleUpdateMeter(meter, "color", color)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setOpen(true);
                          setEditedMeter(meter);
                        }}
                      >
                        {meter.icon ? (
                          <Emoji emoji={meter.icon} size={24} set='emojione' />
                        ) : "Set icon"
                        }
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
                <TableRow>
                  <TableCell>No meters defined yet</TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
        <Dialog
          open={open}
          onClose={(ev, reason) => {
            setOpen(false);
            setEditedMeter(undefined);
          }}
          aria-labelledby="simple-dialog-title"
        >
          <DialogTitle id="simple-dialog-title">Set icon</DialogTitle>
          <div>
            <Picker
              set='emojione'
              onClick={(emoji) => {
                handleUpdateMeter(editedMeter, "icon", emoji.id);
                setEditedMeter(undefined);
                setOpen(false);
              }}
            />
          </div>
        </Dialog>
      </Paper>
    </div>
  );
};

const mapStateToProps = state => ({
  meters: getMeters(state),
  isFetchingMeters: isFetchingMeters(state),
  schemas: getSchemas(state),
  meterError: getMeterError(state)
});

export default compose(
  connect(
    mapStateToProps,
    {
      resetMetersError,
      deleteMeter,
      updateMeter,
      updateMeterRequest
    }
  ),
  withStyles(styles)
)(Meters);
