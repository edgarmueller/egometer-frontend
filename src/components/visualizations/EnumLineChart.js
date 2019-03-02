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

class EnumLineChart extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { data, days, width } = this.props;
    return (
      !_.isEqual(nextProps.data, data) ||
      days.length !== nextProps.days.length ||
      width !== nextProps.width
    );
  }

  render() {
    const { data, days, schema, labelProvider, width } = this.props;
    const reversed = _.reverse(_.cloneDeep(schema.enum));

    const values = days.map(i => ({ x: i, y: 0 }));
    _.forEach(data, ({ date, value }) => {
      const idx = Number(date.substr(date.lastIndexOf("-") + 1, date.length));
      values[idx - 1].y = reversed.indexOf(value);
    });

    const offset = 100;
    return (
      <div style={{ left: -offset }}>
        <XYPlot width={width} height={350} margin={{ left: offset }}>
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis title="Date" tickValues={days} />
          <YAxis title="Mood" tickFormat={i => labelProvider(reversed[i])} />
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
