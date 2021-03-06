import React, { useCallback, useState, useEffect } from "react";
import toNumber from "lodash/toNumber";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
import { Emoji } from "emoji-mart";
import { Switch, Dialog, DialogTitle, Button } from "@material-ui/core";
import { Drawer } from "@material-ui/core";
import { Picker } from "emoji-mart";
import AddIcon from "@material-ui/icons/Add";
import { fetchMeters } from "../../actions";
import ColorPicker from "../common/ColorPicker";
import Loading from "../common/Loading";
import widgets from "../../widgets";
import {
  deleteMeter,
  resetMetersError,
  updateMeter,
  updateMeterRequest,
} from "../../actions";
import { display1 } from "../../common/styles";
import {
  getMeters,
  isMetersLoading,
  getMeterError,
  getSchemas,
} from "../../reducers";
import { findBySchemaId } from "../../utils";
import { ErrorSnackbar } from "../common/ErrorSnackbar";
import AddMeterDrawer from "../common/AddMeterDrawer";
import { schemaPropType } from "../../prop-types";

const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  display1,
  root: {
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "0 auto",
  },
  button: {
    margin: "0.25em",
    float: "right",
  },
  table: {
    width: 700,
    margin: "0 auto",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

const isNumberSchema = (schema) => {
  return schema && schema.type === "number";
};

export const MeterList = ({
  classes,
  deleteMeter,
  meters,
  updateMeterRequest,
  isMetersLoading,
  schemas,
  meterError,
  resetMetersError,
  fetchMeters,
}) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [metersById, setMetersById] = useState(
    meters
      ? meters.reduce((acc, meter) => {
          acc[meter.id] = meter;
          return acc;
        }, {})
      : {}
  );
  useEffect(() => {
    const metersAccumulated = meters.reduce((acc, meter) => {
      acc[meter.id] = meter;
      return acc;
    }, {});
    setMetersById(metersAccumulated);
  }, [meters, setMetersById]);
  const confirmDialog = useCallback(() => {
    setDrawerOpen(false);
    fetchMeters();
  }, [setDrawerOpen, fetchMeters]);
  const [open, setOpen] = useState(false);
  const [editedMeter, setEditedMeter] = useState(undefined);
  const handleUpdateMeter = useCallback(
    (meter, propName, propValue) => {
      const metersAccumulated = meters.reduce((acc, m) => {
        if (m.id === meter.id) {
          acc[m.id] = {
            ...m,
            [propName]: propValue,
          };
        } else {
          acc[m.id] = m;
        }
        return acc;
      }, {});
      setMetersById(metersAccumulated);
      updateMeterRequest({
        ...meter,
        [propName]: propValue,
      });
    },
    [updateMeterRequest, setMetersById, meters]
  );

  const handleDeleteMeter = useCallback(
    (meter) => () => deleteMeter(meter.id),
    [deleteMeter]
  );

  if (isMetersLoading) {
    return <Loading />;
  }

  return (
    <div>
      <ErrorSnackbar error={meterError} resetError={resetMetersError} />
      <Typography variant="h1" className={classes.display1}>
        Manage Meters
      </Typography>
      <Paper className={classes.root}>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          aria-label="Add"
          style={{
            color: "rgb(65, 102, 170)",
            borderRadius: 30,
            margin: "0.25em",
          }}
          onClick={() => setDrawerOpen(true)}
        >
          <AddIcon />
          Add Meter
        </Button>
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
            {Object.keys(metersById).length !== 0 ? (
              Object.keys(metersById).map((meterId) => {
                const meter = metersById[meterId];
                const schema = findBySchemaId(schemas, meter.schemaId);
                return (
                  <TableRow key={meter.id}>
                    <TableCell colSpan={3}>
                      <TextField
                        margin="dense"
                        variant="outlined"
                        value={meter.name}
                        onChange={(ev) =>
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
                          value={meter.dailyGoal}
                          onChange={(ev) =>
                            handleUpdateMeter(
                              meter,
                              "dailyGoal",
                              toNumber(ev.target.value)
                            )
                          }
                        />
                      ) : (
                        <Switch
                          checked={meter.dailyGoal > 0}
                          onChange={(ev, goal) =>
                            handleUpdateMeter(meter, "dailyGoal", goal ? 1 : 0)
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={meter.weeklyGoal}
                        onChange={(ev) =>
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
                        color={meter.color}
                        onChange={() => {}}
                        onChangeComplete={(color) =>
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
                          <Emoji emoji={meter.icon} size={24} set="emojione" />
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
          onClose={() => {
            setOpen(false);
            setEditedMeter(undefined);
          }}
          aria-labelledby="simple-dialog-title"
        >
          <DialogTitle id="simple-dialog-title">Set icon</DialogTitle>
          <div>
            <Picker
              set="emojione"
              onClick={(emoji) => {
                handleUpdateMeter(editedMeter, "icon", emoji.id);
                setEditedMeter(undefined);
                setOpen(false);
              }}
            />
          </div>
        </Dialog>
        <Drawer open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
          <AddMeterDrawer
            open={isDrawerOpen}
            onSubmit={confirmDialog}
            handleClose={() => setDrawerOpen(false)}
            widgets={widgets}
          />
        </Drawer>
      </Paper>
    </div>
  );
};

MeterList.propTypes = {
  classes: PropTypes.object,
  deleteMeter: PropTypes.func,
  meters: PropTypes.array,
  updateMeterRequest: PropTypes.func,
  isMetersLoading: PropTypes.bool,
  schemas: PropTypes.arrayOf(schemaPropType),
  meterError: PropTypes.object,
  resetMetersError: PropTypes.func,
  fetchMeters: PropTypes.func,
};

MeterList.defaultProps = {
  widgets,
};

const mapStateToProps = (state) => ({
  meters: getMeters(state),
  isMetersLoading: isMetersLoading(state),
  schemas: getSchemas(state),
  meterError: getMeterError(state),
});

export default connect(mapStateToProps, {
  resetMetersError,
  deleteMeter,
  updateMeter,
  updateMeterRequest,
  fetchMeters,
})(withStyles(styles)(MeterList));
