import React from "react";
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
import { deleteMeter, updateMeter } from "../../actions";
import { display1 } from "../../common/styles";
import {
  getMeters,
  isFetchingMeters,
  findBySchemaId as _findBySchemaId
} from "../../reducers";

import { Switch } from "@material-ui/core";

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  display1,
  root: {
    width: 720,
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

export class Meters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      editSchema: undefined,
      open: false
    };
    this.deleteMeter = this.deleteMeter.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  deleteMeter(meter) {
    this.props.deleteMeter(meter.id);
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  render() {
    const { classes, meters } = this.props;

    if (this.props.isFetchingMeters) {
      return <div>Loading meters</div>;
    }

    return (
      <div>
        <Typography variant="display1" className={classes.display1}>
          Manage Meters
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Meter name</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Daily Goal</TableCell>
                <TableCell>Weekly Goal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meters ? (
                meters.map(meter => {
                  return (
                    <TableRow key={meter.id}>
                      <TableCell>
                        <strong>{meter.name}</strong>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="Delete meter"
                          onClick={() => this.deleteMeter(meter)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {isNumberSchema(
                          this.props.findBySchemaId(meter.schemaId)
                        ) ? (
                          <TextField
                            value={meter.dailyGoal || ""}
                            onChange={ev => {
                              this.props.updateMeter({
                                ...meter,
                                dailyGoal: Number(ev.target.value)
                              });
                            }}
                          />
                        ) : (
                          <Switch
                            checked={meter.dailyGoal > 0}
                            onChange={(ev, value) => {
                              this.props.updateMeter({
                                ...meter,
                                dailyGoal: value ? 1 : 0
                              });
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={meter.weeklyGoal || ""}
                          onChange={ev => {
                            this.props.updateMeter({
                              ...meter,
                              weeklyGoal: Number(ev.target.value)
                            });
                          }}
                        />
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
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  meters: getMeters(state),
  isFetchingMeters: isFetchingMeters(state),
  findBySchemaId(schemaId) {
    const foundSchema = _findBySchemaId(schemaId)(state);
    if (foundSchema !== undefined) {
      return foundSchema.schema;
    }
    return undefined;
  }
});

export default compose(
  connect(
    mapStateToProps,
    {
      deleteMeter,
      updateMeter
    }
  ),
  withStyles(styles)
)(Meters);
