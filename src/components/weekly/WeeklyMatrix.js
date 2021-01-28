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
      schemas,
    } = this.props;

    return (
      <MeterTable
        calcProgress={calcWeeklyProgress}
        entriesByMeter={entriesByMeter}
        meters={meters}
        schemas={schemas}
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
  schemas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      schema: PropTypes.object,
    })
  ),
  colorMapping: PropTypes.object,
  entriesByMeter: PropTypes.object,
  days: PropTypes.array,
};

WeeklyMatrix.defaultProps = {
  isLoading: false,
};

export default WeeklyMatrix;
