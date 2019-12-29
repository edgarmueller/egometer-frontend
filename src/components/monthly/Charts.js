import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import {
  entriesPropType,
  meterPropTypes,
  widgetPropTypes
} from "../../prop-types";

const Charts = ({
  days,
  entriesByMeter,
  findBySchemaId,
  meters,
  widgets,
  width,
  widgetType
}) => {

  if (_.isEmpty(entriesByMeter)) {
    return "no data";
  }

  const meterWidgets = meters
    .map(meter => {
      const widget = widgets.find(widget => widget.name === meter.widget);
      return {
        widget: widget && widget[widgetType],
        meter
      };
    })
    .filter(vis => vis.widget !== undefined);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {meterWidgets.map(({ meter, widget }) => {
        const data = entriesByMeter[meter.id];
        const schema = findBySchemaId(meter.schemaId);

        if (schema === undefined) {
          return null;
        }

        const Chart = widget;
        return (
          <div key={meter.name}>
            <Typography style={{ fontWeight: 600 }} variant="h6">
              {meter.name}
            </Typography>
            <Chart
              meter={meter}
              data={data}
              schema={schema}
              days={days}
              width={width}
            />
          </div>
        );
      })}
    </div>
  );
};

Charts.propTypes = {
  days: PropTypes.array,
  entriesByMeter: entriesPropType,
  findBySchemaId: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  meters: PropTypes.arrayOf(meterPropTypes),
  widgets: PropTypes.arrayOf(widgetPropTypes),
  widgetType: PropTypes.oneOf(["month", "week"]),
  width: PropTypes.number.isRequired
};

Charts.defaultProps = {
  entries: {}
};

export default Charts;
