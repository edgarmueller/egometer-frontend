import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import { compose, withProps } from "recompose";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import widgets from "../../widgets";
import IconButtonWithLabel from "../common/IconButtonWithLabel";
import { getSchemas, findBySchemaName } from "../../reducers";
import * as api from "../../api";

const filterApplicableWidgets = (widgets, schema) => {
  return _.filter(widgets, widget => widget.isApplicable(schema) > -1);
};

const renderWidgetsPerCategory = (
  widgetsByCategory,
  category,
  findBySchemaName,
  handleSubmit,
  drawTitle = true
) => {
  const availableWidgets = widgetsByCategory[category];
  return (
    <div
      key={category}
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginBottom: "0.5em"
      }}
    >
      {drawTitle && <strong style={{ color: "#878787" }}>{category}</strong>}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {availableWidgets
            .filter(vis => vis.name !== undefined && vis.label !== undefined)
            .map(widget => (
              <IconButtonWithLabel
                key={widget.name}
                label={widget.label}
                icon={widget.icon}
                onSubmit={() => {
                  handleSubmit(
                    // schemaId === schema name
                    findBySchemaName(widget.schemaId).id,
                    widget.label,
                    widget.name
                  );
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export class AddMeterDialog extends React.Component {
  constructor(props) {
    super(props);
    const applicableWidgets = !_.isEmpty(props.schemas)
      ? filterApplicableWidgets(props.widgets, _.head(props.schemas).schema)
      : [];
    this.state = {
      selectedSchema:
        props.schemas.length > 0 ? _.head(props.schemas) : undefined,
      selectedVis:
        _.head(applicableWidgets) !== undefined
          ? _.head(applicableWidgets).name
          : "",
      applicableVis: applicableWidgets,
      name: ""
    };
  }

  handleSubmit = (schemaId, name, widget) => {
    api
      .createMeter(schemaId, name.trim(), widget, "#cecece")
      .then(
        () => this.props.onSubmit(),
        errorMsg => this.setState({ error: errorMsg })
      );
  };

  render() {
    const { findBySchemaName, open, handleClose, widgets } = this.props;
    const widgetsByCategory = _.groupBy(
      _.map(widgets, widget => {
        const category = _.isEmpty(widget.category)
          ? "Uncategorized"
          : widget.category;
        return {
          ...widget,
          category
        };
      }),
      widget => widget.category
    );

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-schema-title"
        aria-describedby="alert-schema-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="alert-schema-title">Add Meter</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <strong style={{ fontSize: 20 }}>Pre-defined meters</strong>
            {_.map(
              _.keys(widgetsByCategory).filter(
                category => category !== "Custom"
              ),
              category =>
                renderWidgetsPerCategory(
                  widgetsByCategory,
                  category,
                  findBySchemaName,
                  this.handleSubmit
                )
            )}
            <strong>Custom meter</strong>
            {renderWidgetsPerCategory(
              widgetsByCategory,
              "Custom",
              findBySchemaName,
              this.handleSubmit,
              false
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddMeterDialog.propTypes = {
  findBySchemaName: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  widgets: PropTypes.array.isRequired
};

AddMeterDialog.defaultProps = {
  open: false
};

const mapStateToProps = state => ({
  schemas: getSchemas(state),
  findBySchemaName(schemaName) {
    return findBySchemaName(schemaName)(state);
  }
});

export default compose(
  withProps({ widgets }),
  connect(
    mapStateToProps,
    null
  )
)(AddMeterDialog);
