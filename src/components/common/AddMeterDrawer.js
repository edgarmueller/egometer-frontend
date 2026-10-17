import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Typography from "@material-ui/core/Typography";

import Category from "../daily/Category";
import widgets from "../../widgets";
import * as api from "../../api";

export class AddMeterDrawer extends React.PureComponent {
  state = {};

  handleSubmit = (meterType, name) => {
    api.createMeter(meterType, name.trim(), "#cecece").then(
      () => this.props.onSubmit(),
      (error) =>
        this.setState({
          error: error.message,
        })
    );
  };

  render() {
    // only widgets that a new meter can be created with
    const creatableWidgets = this.props.widgets.filter(
      (widget) => widget.meterType !== undefined && widget.label !== undefined
    );
    const widgetsByCategory = _.groupBy(creatableWidgets, (widget) =>
      _.isEmpty(widget.category) ? "Uncategorized" : widget.category
    );
    // "Custom" goes last
    const categories = _.sortBy(_.keys(widgetsByCategory), (category) =>
      category === "Custom" ? 1 : 0
    );

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          Add meter
        </Typography>
        {categories.map((category) => (
          <Category
            key={category}
            widgets={widgetsByCategory[category]}
            category={category}
            handleSubmit={this.handleSubmit}
            drawTitle
          />
        ))}
        {this.state.error && (
          <Typography variant="body1" color="error">
            {this.state.error}
          </Typography>
        )}
      </div>
    );
  }
}

AddMeterDrawer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  widgets: PropTypes.array.isRequired,
};

AddMeterDrawer.defaultProps = {
  widgets,
};

export default AddMeterDrawer;
