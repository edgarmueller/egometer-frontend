import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as _ from "lodash";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import { getSchemas, findBySchemaName } from "../../reducers";
import * as api from "../../api";

const NO_WIDGET = "noWidget";

const filterApplicableWidgets = (widgets, schema) => {
  return _.filter(widgets, widget => widget.isApplicable(schema) > -1);
};

export class CreateMeterDialog extends React.Component {
  constructor(props) {
    super(props);
    const { schemas, widgets } = props;
    const applicableWidgets = !_.isEmpty(schemas)
      ? filterApplicableWidgets(widgets, _.head(schemas).schema)
      : [];
    this.state = {
      selectedSchema: schemas.length > 0 ? _.head(schemas) : undefined,
      selectedWidget:
        _.head(applicableWidgets) !== undefined
          ? _.head(applicableWidgets).name
          : "",
      applicableWidgets,
      name: ""
    };
  }

  handleSubmit = () => {
    const schema = this.state.selectedSchema;
    const name = this.state.name;
    const widget = this.state.selectedWidget;
    api
      .createMeter(schema.id, name, widget, "#cecece")
      .then(
        () => this.props.onSubmit(),
        errorMsg => this.setState({ error: errorMsg })
      );
  };

  render() {
    const { widgets, schemas, findBySchemaName, open, onClose } = this.props;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-schema-title"
        aria-describedby="alert-schema-description"
      >
        <DialogTitle id="alert-schema-title">Create new Meter</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-schema-description">
            Please enter a name for the new meter
          </DialogContentText>
          <div>
            <TextField
              id="meter-name"
              label="Meter name"
              onChange={ev => {
                this.setState({
                  name: ev.target.value,
                  error: undefined
                });
              }}
              autoFocus
              fullWidth
              required
              error={!_.isEmpty(this.state.error)}
              value={this.state.name || ""}
              helperText={this.state.error ? <div>{this.state.error}</div> : ""}
            />
          </div>
          <div>
            <Select
              value={
                (this.state.selectedSchema &&
                  _.get(this.state.selectedSchema, "name")) ||
                ""
              }
              fullWidth
              onChange={ev => {
                const schema = findBySchemaName(ev.target.value);
                const applicableWidgets = filterApplicableWidgets(
                  widgets,
                  schema.schema
                );
                const maybeWidget = _.head(applicableWidgets);
                this.setState({
                  selectedSchema: schema,
                  applicableWidgets,
                  selectedWidget:
                    maybeWidget !== undefined ? maybeWidget.name : NO_WIDGET
                });
              }}
              style={{
                margin: "auto",
                marginLeft: 0,
                marginRight: 0
              }}
            >
              {schemas &&
                schemas.map(schema => (
                  <MenuItem key={schema.id} value={schema.name || ""}>
                    {schema.name}
                  </MenuItem>
                ))}
            </Select>
          </div>
          <div>
            <Select
              value={this.state.selectedWidget || NO_WIDGET}
              fullWidth
              onChange={ev => {
                this.setState({
                  selectedWidget: ev.target.value
                });
              }}
            >
              {this.state.applicableWidgets.length === 0 ? (
                <MenuItem key={NO_WIDGET} value={NO_WIDGET}>
                  No applicable widget
                </MenuItem>
              ) : (
                this.state.applicableWidgets &&
                this.state.applicableWidgets.map(widget => {
                  return (
                    <MenuItem key={widget.name} value={widget.name || ""}>
                      {widget.name}
                    </MenuItem>
                  );
                })
              )}
            </Select>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleSubmit} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

CreateMeterDialog.propTypes = {
  open: PropTypes.bool,
  findBySchemaName: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  widgets: PropTypes.array.isRequired
};

CreateMeterDialog.defaultProps = {
  open: false
};

const mapStateToProps = state => ({
  schemas: getSchemas(state),
  findBySchemaName(schemaName) {
    return findBySchemaName(schemaName)(state);
  }
});

export default connect(
  mapStateToProps,
  null
)(CreateMeterDialog);
