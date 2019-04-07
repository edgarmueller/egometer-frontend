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
import { findByDate } from "../../common/date";

class NumberBarChart extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { data, days, meter, width } = this.props;
    return (
      !_.isEqual(nextProps.data, data) ||
      !_.isEqual(days, nextProps.days) ||
      meter.name !== nextProps.meter.name ||
      width !== nextProps.width
    );
  }

  render() {
    const { data, days, meter, width } = this.props;
    const values = days.map((d, i) => {
      const entry = findByDate(data, d.getDate());
      return {
        x: i,
        y: entry ? entry.value : 0
      };
    });
    const valuesOnly = values.map(({ x, y }) => y);
    const labels = days.map(day => day.getDate().toString());

    return (
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <span>
            <strong>Average</strong>: {_.round(_.sum(valuesOnly) / valuesOnly.length, 2)}
          </span>
          <span><strong>Min</strong>: {_.min(valuesOnly)}</span>
          <span><strong>Max</strong>: {_.max(valuesOnly)}</span>
        </div>
        <XYPlot width={width} height={250} color="#20211f">
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis
            title="Date"
            tickValues={days.map((d, i) => i)}
            tickFormat={(value, index) => {
              return labels[index];
            }}
          />
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
  days: PropTypes.array.isRequired,
  schema: PropTypes.shape({
    enum: PropTypes.array
  }).isRequired
};

NumberBarChart.defaultProps = {
  data: []
};

export default NumberBarChart;
