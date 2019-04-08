import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
// TODO only import once?
import "react-vis/dist/style.css";

import { RadialChart } from "react-vis";

// TODO: create mapping to activities
const colorRange = [
  "#84e0cc",
  "#ed5f42",
  "#f8ff82",
  "#5ce894",
  "#B5FFE1",
  "#B8E1FF",
  "#EDD3C4",
  "#eac9e0",
  "#C2DBD8",
  "#9684ff",
  "#fcf3ab",
  "#ffaf99",
  "#d0f1f4",
  "#7795ff",
  "#E2F1AF"
];

class MultiEnumPieChart extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { data } = this.props;
    return !_.isEqual(nextProps.data, data);
  }

  render() {
    const { data } = this.props;

    const values = _.flatMap(data, d => d.value);
    const groupedValues = values.reduce((acc, val) => {
      if (_.has(acc, val)) {
        return _.update(acc, val, cnt => cnt + 1);
      } else {
        return _.set(acc, val, 1);
      }
    }, {});

    const angles = _.keys(groupedValues).map(key => {
      return {
        angle: groupedValues[key],
        label: _.startCase(key)
      };
    });

    if (data.length > 0) {
      return <div>No data</div>;
    }

    return (
      <div>
        <RadialChart
          colorType="category"
          colorDomain={[0, 1, 2]}
          colorRange={colorRange}
          data={angles}
          width={400}
          height={400}
          showLabels={true}
          labelsStyle={{
            color: "#212121",
            fontWeight: "bold"
          }}
        />
      </div>
    );
  }
}

MultiEnumPieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  days: PropTypes.array.isRequired,
  schema: PropTypes.shape({
    enum: PropTypes.array
  }).isRequired
};
MultiEnumPieChart.defaultProps = {
  data: []
};

export default MultiEnumPieChart;
