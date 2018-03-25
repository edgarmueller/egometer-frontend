import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  entriesPropType,
  meterPropTypes,
  widgetPropTypes
} from "../../prop-types";

const Charts = ({
  days,
  entries,
  findBySchemaId,
  isLoading,
  meters,
  widgets,
  width
}) => {
  if (isLoading) {
    // parent show loading indicator
    return null;
  }

  if (_.isEmpty(entries)) {
    return "no data";
  }

  const meterWidgets = meters
    .map(meter => {
      const widget = widgets.find(widget => widget.name === meter.widget);
      return {
        widget: widget && widget.month,
        meter
      };
    })
    .filter(vis => vis.widget !== undefined);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {meterWidgets.map(({ meter, widget }) => {
        const data = entries[meter.id];
        const schema = findBySchemaId(meter.schemaId);
        const Chart = widget;
        return (
          <div key={meter.name}>
            <strong>{meter.name}</strong>
            <Chart
              meter={meter}
              data={data}
              schema={schema}
              days={_.range(1, days + 1)}
              width={width}
            />
          </div>
        );
      })}
    </div>
  );
};

Charts.propTypes = {
  days: PropTypes.number.isRequired,
  entries: entriesPropType,
  findBySchemaId: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  meters: PropTypes.arrayOf(meterPropTypes),
  widgets: PropTypes.arrayOf(widgetPropTypes),
  width: PropTypes.number.isRequired
};

Charts.defaultProps = {
  entries: []
};

export default Charts;
