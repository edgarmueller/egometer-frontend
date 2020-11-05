import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import { compose, withProps } from "recompose";
import Typography from "@material-ui/core/Typography";

import Category from "../daily/Category";
import widgets from "../../widgets";
import { getSchemas } from "../../reducers";
import * as api from "../../api";
import { findBySchemaName } from "../../utils";

const filterApplicableWidgets = (widgets, schema) => {
  return _.filter(widgets, (widget) => widget.isApplicable(schema) > -1);
};
export class AddMeterDrawer extends React.PureComponent {
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
      name: "",
    };
  }

  handleSubmit = (schemaId, name, widget) => {
    api.createMeter(schemaId, name.trim(), widget, "#cecece").then(
      () => this.props.onSubmit(),
      (errorMsg) =>
        this.setState({
          error: errorMsg,
        })
    );
  };

  findSchema = (schemaName) => {
    return findBySchemaName(this.props.schemas, schemaName);
  };

  render() {
    const { widgets, schemas } = this.props;

    const widgetsByCategory = _.groupBy(
      _.map(widgets, (widget) => {
        const category = _.isEmpty(widget.category)
          ? "Uncategorized"
          : widget.category;
        return {
          ...widget,
          category,
        };
      }),
      (widget) => widget.category
    );

    const availableSchemaIds = schemas.map((schema) => schema.name);
    const widgetsPerCategory = _.keys(widgetsByCategory)
      .filter((category) => category !== "Custom")
      .concat(["Custom"])
      .reduce((acc, category) => {
        const availableWidgets = widgetsByCategory[category];
        const applicableWidgets = availableWidgets.filter(
          (vis) =>
            vis.name !== undefined &&
            vis.label !== undefined &&
            availableSchemaIds.indexOf(vis.schemaId) !== -1
        );
        if (applicableWidgets.length > 0) {
          acc[category] = applicableWidgets;
        }
        return acc;
      }, {});

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" style={{ fontWeight: "bold" }}>
          Add meter
        </Typography>
        {_.keys(widgetsPerCategory).length > 0 ? (
          _.map(_.keys(widgetsPerCategory), (category) => (
            <Category
              key={category}
              widgets={widgetsPerCategory[category]}
              category={category}
              schemas={schemas}
              findBySchemaName={this.findSchema}
              handleSubmit={this.handleSubmit}
              drawTitle
            />
          ))
        ) : (
          <Typography variant="body1">
            Sorry, no widgets seem applicable
          </Typography>
        )}
      </div>
    );
  }
}

AddMeterDrawer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  widgets: PropTypes.array.isRequired,
  schemas: PropTypes.array,
};

AddMeterDrawer.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({
  schemas: getSchemas(state),
});

export default compose(
  withProps({ widgets }),
  connect(mapStateToProps, null)
)(AddMeterDrawer);
