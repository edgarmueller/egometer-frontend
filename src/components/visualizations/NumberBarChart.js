import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import "react-vis/dist/style.css";

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  VerticalBarSeries
} from "react-vis";

class NumberBarChart extends React.Component {
  render() {
    const { data, days, meter, width } = this.props;
    const values = days.map(i => ({ x: i, y: 0 }));
    _.forEach(data, val => {
      const idx = Number(
        val.date.substr(val.date.lastIndexOf("-") + 1, val.date.length)
      );
      values[idx - 1].y = val.value;
    });

    return (
      <div>
        <XYPlot width={width} height={250} color="#20211f">
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis title="Date" tickValues={days} />
          <YAxis title={meter.name} />
          <VerticalBarSeries data={values} />
        </XYPlot>
      </div>
    );
  }
}

NumberBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number
    })
  ),
  days: PropTypes.arrayOf(PropTypes.number).isRequired,
  schema: PropTypes.shape({
    enum: PropTypes.array
  }).isRequired
};

NumberBarChart.defaultProps = {
  data: []
};

export default NumberBarChart;
