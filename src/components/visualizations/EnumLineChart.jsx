import React from "react";
import _ from "lodash";
import moment from "moment";
import "react-vis/dist/style.css";
import { chartPropTypes } from "../../prop-types";

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  MarkSeries,
} from "react-vis";

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
    // the values from bottom to top, e.g. from the worst to the best mood
    const values = schema.enum;
    const points = days.map((day, i) => {
      const date = moment(day).format("YYYY-MM-DD");
      const entry = _.find(data, (e) => e.date === date);
      const y = entry ? values.indexOf(entry.value) : -1;
      // days without an entry leave a gap
      return { x: i, y: y === -1 ? null : y };
    });
    const labels = days.map((day) => day.getDate().toString());

    const offset = 100;
    return (
      <div style={{ left: -offset }}>
        <XYPlot
          width={width}
          height={350}
          margin={{ left: offset }}
          xDomain={[0, days.length - 1]}
          yDomain={[0, values.length - 1]}
        >
          <HorizontalGridLines tickValues={values.map((value, i) => i)} />
          <VerticalGridLines />
          <XAxis
            title="Date"
            tickValues={days.map((d, i) => i)}
            tickFormat={(value, index) => labels[index]}
          />
          <YAxis
            title={meter.name}
            tickValues={values.map((value, i) => i)}
            tickFormat={(i) => labelProvider(values[i])}
          />
          <LineSeries
            data={points}
            getNull={(point) => point.y !== null}
            color="#20211f"
          />
          {/* dots, so that days surrounded by gaps are visible too */}
          <MarkSeries
            data={points.filter((point) => point.y !== null)}
            size={3}
            color="#20211f"
          />
        </XYPlot>
      </div>
    );
  }
}

EnumLineChart.propTypes = chartPropTypes;

EnumLineChart.defaultProps = {
  data: [],
};

export default EnumLineChart;
