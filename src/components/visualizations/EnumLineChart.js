import React from "react";
import _ from "lodash";
import "react-vis/dist/style.css";
import { chartPropTypes } from "../../prop-types";

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries
} from "react-vis";
import { findByDate } from "../../common/date";

class EnumLineChart extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { data, days, width } = this.props;
    return (
      !_.isEqual(nextProps.data, data) ||
      !_.isEqual(days, nextProps.days) ||
      width !== nextProps.width
    );
  }

  render() {
    const { data, days, schema, labelProvider, meter, width } = this.props;
    const reversed = _.reverse(_.cloneDeep(schema.enum));
    const values = days.map((d, i) => {
      const entry = findByDate(data, d.getDate());
      return {
        x: i,
        y: entry ? reversed.indexOf(entry.value) : 0
      };
    });
    const labels = days.map(day => day.getDate().toString());

    const offset = 100;
    return (
      <div style={{ left: -offset }}>
        <XYPlot width={width} height={350} margin={{ left: offset }}>
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis
            title="Date"
            tickValues={days.map((d, i) => i)}
            tickFormat={(value, index) => labels[index] }
          />
          <YAxis
            title={meter.name}
            tickFormat={i => labelProvider(reversed[i])}
          />
          <LineSeries data={values} color="#20211f" />
        </XYPlot>
      </div>
    );
  }
}

EnumLineChart.propTypes = chartPropTypes;

EnumLineChart.defaultProps = {
  data: []
};

export default EnumLineChart;
