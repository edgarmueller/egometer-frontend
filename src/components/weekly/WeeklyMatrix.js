import * as React from "react";
import PropTypes from "prop-types";
import MeterTable from "../common/MeterTable";
import { calcWeeklyProgress } from "../../common/progress";

class WeeklyMatrix extends React.Component {
  render() {
    const {
      colorMapping,
      entriesByMeter,
      meters,
      isLoading,
      days,
      widgets,
    } = this.props;

    return (
      <MeterTable
        calcProgress={calcWeeklyProgress}
        entriesByMeter={entriesByMeter}
        meters={meters}
        days={days}
        colorMapping={colorMapping}
        widgets={widgets}
        isLoading={isLoading}
        width={768}
      />
    );
  }
}

WeeklyMatrix.propTypes = {
  isLoading: PropTypes.bool,
  meters: PropTypes.arrayOf(PropTypes.object),
  widgets: PropTypes.array,
  colorMapping: PropTypes.object,
  entriesByMeter: PropTypes.object,
  days: PropTypes.array,
};

WeeklyMatrix.defaultProps = {
  isLoading: false,
};

export default WeeklyMatrix;
