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
  render() {
    const { data, days, schema, labelProvider, width } = this.props;

    const values = data.map((d, idx) => {
      return {
        x: idx,
        y: _.reverse(_.cloneDeep(schema.enum)).indexOf(d.value) + 1
      };
    });

    const offset = 100;
    return (
      <div style={{ left: -offset }}>
        <XYPlot width={width} height={350} margin={{ left: offset }}>
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis title="Date" tickValues={days} />
          <YAxis
            title="Mood"
            tickFormat={i =>
              labelProvider(_.reverse(_.cloneDeep(schema.enum))[i - 1])
            }
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
