import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import AddRounded from "@mui/icons-material/AddRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import ChecklistRounded from "@mui/icons-material/ChecklistRounded";
import TuneRounded from "@mui/icons-material/TuneRounded";
import FlagRounded from "@mui/icons-material/FlagRounded";
import {
  deleteMeter,
  fetchMeters,
  resetMetersError,
  updateMeterRequest,
} from "../../actions";
import { getMeters, isMetersLoading, getMeterError } from "../../reducers";
import { meterType } from "../../common/meterTypes";
import PageHeader from "../layout/PageHeader";
import Loading from "../common/Loading";
import EmptyState from "../common/EmptyState";
import MeterAvatar from "../common/MeterAvatar";
import ColorPicker, { COLORS } from "../common/ColorPicker";
import TimesPerWeekSelect from "../common/TimesPerWeekSelect";
import ErrorSnackbar from "../common/ErrorSnackbar";
import AddMeterDialog from "./AddMeterDialog";
import IconPicker from "./IconPicker";
import ActivitiesDialog from "./ActivitiesDialog";

const GoalField = ({ label, value, onChange }) => (
  <TextField
    size="small"
    type="number"
    label={label}
    value={value || ""}
    onChange={(event) => onChange(Number(event.target.value))}
    slotProps={{ htmlInput: { min: 0, step: "any" } }}
    sx={{ width: 120 }}
  />
);

GoalField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export const MeterList = ({
  deleteMeter,
  meters,
  updateMeterRequest,
  isMetersLoading,
  meterError,
  resetMetersError,
  fetchMeters,
}) => {
  // edits are shown right away and saved once typing pauses
  const [editedMeters, setEditedMeters] = useState(meters);
  useEffect(() => setEditedMeters(meters), [meters]);
  const [isAddOpen, setAddOpen] = useState(false);
  // the meters whose icon, activities or deletion are being edited
  const [iconMeter, setIconMeter] = useState(undefined);
  const [activitiesMeter, setActivitiesMeter] = useState(undefined);
  const [deletedMeter, setDeletedMeter] = useState(undefined);

  const handleUpdateMeter = useCallback(
    (meter, changes) => {
      const updated = { ...meter, ...changes };
      setEditedMeters((current) =>
        current.map((m) => (m.id === meter.id ? updated : m))
      );
      updateMeterRequest(updated);
    },
    [updateMeterRequest]
  );

  // reloading the meters, e.g. after adding one, keeps showing them
  if (isMetersLoading && meters.length === 0) {
    return <Loading />;
  }

  const addButton = (
    <Button
      variant="contained"
      startIcon={<AddRounded />}
      onClick={() => setAddOpen(true)}
    >
      Add meter
    </Button>
  );

  return (
    <>
      <PageHeader title="Meters" subtitle="What you track every day">
        {editedMeters.length > 0 && addButton}
      </PageHeader>
      <Card>
        {editedMeters.length === 0 ? (
          <EmptyState
            icon={<TuneRounded sx={{ fontSize: 48 }} />}
            title="No meters yet"
            action={addButton}
          >
            Meters track one thing per day, like your mood, your activities or a
            number.
          </EmptyState>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Meter</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Goals</TableCell>
                  <TableCell align="right" aria-label="Actions" />
                </TableRow>
              </TableHead>
              <TableBody>
                {editedMeters.map((meter) => {
                  const { label, Icon } = meterType(meter);
                  return (
                    <TableRow key={meter.id} hover>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Tooltip title="Change icon">
                            <ButtonBase
                              aria-label={`Icon of ${meter.name}`}
                              onClick={() => setIconMeter(meter)}
                              sx={{ borderRadius: 2 }}
                            >
                              <MeterAvatar meter={meter} size={40} />
                            </ButtonBase>
                          </Tooltip>
                          <TextField
                            size="small"
                            value={meter.name}
                            onChange={(ev) =>
                              handleUpdateMeter(meter, {
                                name: ev.target.value,
                              })
                            }
                            slotProps={{
                              htmlInput: {
                                "aria-label": "Name",
                                maxLength: 100,
                              },
                            }}
                            sx={{ minWidth: { xs: 130, sm: 180 } }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<Icon />}
                          label={label}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <ColorPicker
                          color={meter.color || COLORS[0]}
                          onChange={(color) =>
                            handleUpdateMeter(meter, { color })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {meter.type === "activities" ? (
                          <Button
                            size="small"
                            startIcon={<FlagRounded />}
                            onClick={() => setActivitiesMeter(meter)}
                          >
                            {(meter.activityGoals || []).length > 0
                              ? `${meter.activityGoals.length} activity ${
                                  meter.activityGoals.length === 1
                                    ? "goal"
                                    : "goals"
                                }`
                              : "Set activity goals"}
                          </Button>
                        ) : (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <TimesPerWeekSelect
                              label="Weekly goal"
                              value={meter.weeklyGoal}
                              onChange={(goal) =>
                                handleUpdateMeter(meter, { weeklyGoal: goal })
                              }
                            />
                            {meter.type === "number" && (
                              <GoalField
                                label="Daily goal"
                                value={meter.dailyGoal}
                                onChange={(goal) =>
                                  handleUpdateMeter(meter, { dailyGoal: goal })
                                }
                              />
                            )}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {meter.type === "activities" && (
                          <Tooltip title="Edit activities and goals">
                            <IconButton
                              aria-label="Edit activities"
                              onClick={() => setActivitiesMeter(meter)}
                            >
                              <ChecklistRounded />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete meter">
                          <IconButton
                            aria-label="Delete meter"
                            onClick={() => setDeletedMeter(meter)}
                          >
                            <DeleteOutlineRounded />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
      <AddMeterDialog
        open={isAddOpen}
        // new meters get the next color of the palette
        color={COLORS[editedMeters.length % COLORS.length]}
        onClose={() => setAddOpen(false)}
        onCreated={() => {
          setAddOpen(false);
          fetchMeters();
        }}
      />
      <IconPicker
        open={iconMeter !== undefined}
        meterName={iconMeter && iconMeter.name}
        hasIcon={!!(iconMeter && iconMeter.icon)}
        onPick={(icon) => {
          handleUpdateMeter(iconMeter, { icon });
          setIconMeter(undefined);
        }}
        onClose={() => setIconMeter(undefined)}
      />
      <ActivitiesDialog
        open={activitiesMeter !== undefined}
        meterName={activitiesMeter && activitiesMeter.name}
        activities={(activitiesMeter && activitiesMeter.options) || []}
        goals={activitiesMeter && activitiesMeter.activityGoals}
        onSave={(activities, goals) =>
          handleUpdateMeter(activitiesMeter, {
            options: activities,
            activityGoals: goals,
          })
        }
        onClose={() => setActivitiesMeter(undefined)}
      />
      <Dialog
        open={deletedMeter !== undefined}
        onClose={() => setDeletedMeter(undefined)}
        aria-labelledby="delete-meter-title"
      >
        <DialogTitle id="delete-meter-title">
          Delete {deletedMeter && deletedMeter.name}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This also deletes everything you tracked with this meter.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletedMeter(undefined)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteMeter(deletedMeter.id);
              setDeletedMeter(undefined);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ErrorSnackbar error={meterError} onClose={resetMetersError} />
    </>
  );
};

MeterList.propTypes = {
  deleteMeter: PropTypes.func.isRequired,
  meters: PropTypes.array.isRequired,
  updateMeterRequest: PropTypes.func.isRequired,
  isMetersLoading: PropTypes.bool,
  meterError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  resetMetersError: PropTypes.func.isRequired,
  fetchMeters: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  meters: getMeters(state),
  isMetersLoading: isMetersLoading(state),
  meterError: getMeterError(state),
});

export default connect(mapStateToProps, {
  resetMetersError,
  deleteMeter,
  updateMeterRequest,
  fetchMeters,
})(MeterList);
