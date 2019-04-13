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
import {
  Switch,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Avatar
} from "@material-ui/core";
import Ionicon from "react-ionicons";
import ColorPicker from "../common/ColorPicker";
import { deleteMeter, updateMeter, updateMeterRequest } from "../../actions";
import { display1 } from "../../common/styles";
import {
  getMeters,
  isFetchingMeters,
  getMeterError,
  getSchemas
} from "../../reducers";
import { findBySchemaId } from "../../utils";
import { ErrorSnackbar } from "../common/ErrorSnackbar";

const icons = [
  "md-alarm",
  "md-american-football",
  "md-appstore",
  "md-at",
  "md-attach",
  "md-baseball",
  "md-basket",
  "md-basketball",
  "md-beer",
  "md-bicycle",
  "md-boat",
  "md-body",
  "md-bonfire",
  "md-book",
  "md-briefcase",
  "md-brush",
  "md-bulb",
  "md-bus",
  "md-cafe",
  "md-calculator",
  "md-calendar",
  "md-call",
  "md-camera",
  "md-car",
  "md-card",
  "md-cart",
  "md-cash",
  "md-chatbubbles",
  "md-clock",
  "md-cloud",
  "md-cloudy-night",
  "md-cloudy",
  "md-color-fill",
  "md-contact",
  "md-contacts",
  "md-create",
  "md-cube",
  "md-cut",
  "md-desktop",
  "md-disc",
  "md-document",
  "md-done-all",
  "md-download",
  "md-egg",
  "md-exit",
  "md-eye",
  "md-female",
  "md-film",
  "md-flash",
  "md-flower",
  "md-football",
  "md-game-controller-b",
  "md-glasses",
  "md-globe",
  "md-hammer",
  "md-happy",
  "md-headset",
  "md-heart",
  "md-home",
  "md-ice-cream",
  "md-jet",
  "md-key",
  "md-laptop",
  "md-leaf",
  "md-mail",
  "md-male",
  "md-man",
  "md-map",
  "md-medal",
  "md-medical",
  "md-medkit",
  "md-mic",
  "md-moon",
  "md-musical-note",
  "md-no-smoking",
  "md-notifications",
  "md-nuclear",
  "md-nutrition",
  "md-outlet",
  "md-paper-plane",
  "md-paper",
  "md-partly-sunny",
  "md-pause",
  "md-paw",
  "md-people",
  "md-person",
  "md-phone-portrait",
  "md-photos",
  "md-pie",
  "md-pint",
  "md-pizza",
  "md-plane",
  "md-planet",
  "md-play",
  "md-power",
  "md-pricetag",
  "md-pricetags",
  "md-print",
  "md-pulse",
  "md-radio",
  "md-rainy",
  "md-restaurant",
  "md-ribbon",
  "md-rose",
  "md-sad",
  "md-school",
  "md-search",
  "md-send",
  "md-settings",
  "md-shirt",
  "md-snow",
  "md-speedometer",
  "md-star",
  "md-stopwatch",
  "md-subway",
  "md-sunny",
  "md-tennisball",
  "md-thermometer",
  "md-thumbs-down",
  "md-thumbs-up",
  "md-thunderstorm",
  "md-time",
  "md-train",
  "md-transgender",
  "md-trash",
  "md-trending-down",
  "md-trending-up",
  "md-trophy",
  "md-umbrella",
  "md-videocam",
  "md-volume-up",
  "md-walk",
  "md-warning",
  "md-watch",
  "md-water",
  "md-wifi",
  "md-wine",
  "md-woman"
];

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
  meterError
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
  });

  const handleDeleteMeter = useCallback(meter => () => deleteMeter(meter.id));
  useEffect(() => dispatch({ type: UPDATE_ALL, payload: metersById(meters) }), [
    meters
  ]);

  if (isFetchingMeters) {
    return <div>Loading meters</div>;
  }

  return (
    <div>
      <ErrorSnackbar error={meterError} resetError={() => {}} />
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
                        onChange={() => {}}
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
                          <Ionicon icon={meter.icon} />
                        ) : (
                          "Set icon"
                        )}
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
            <List>
              {icons.map(icon => (
                <ListItem
                  button
                  key={icon}
                  onClick={() => {
                    handleUpdateMeter(editedMeter, "icon", icon);
                    setEditedMeter(undefined);
                    setOpen(false);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <Ionicon icon={icon} color="#fff" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={icon} />
                </ListItem>
              ))}
            </List>
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
      deleteMeter,
      updateMeter,
      updateMeterRequest
    }
  ),
  withStyles(styles)
)(Meters);
