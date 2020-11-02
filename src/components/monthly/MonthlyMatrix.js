import * as React from "react";
import { AutoSizer } from "react-virtualized";
import PropTypes from "prop-types";
import MeterTable from "../common/MeterTable";
import { calcMonthlyProgress } from "../../common/progress";

class MonthlyMatrix extends React.Component {
  render() {
    const {
      meters,
      days,
      entriesByMeter,
      progressByMeter,
      schemas,
      colorMapping,
      isLoading,
      widgets,
    } = this.props;

    return (
      <AutoSizer disableHeight defaultHeight={768} defaultWidth={1024}>
        {({ width }) => (
          <MeterTable
            calcProgress={calcMonthlyProgress}
            entriesByMeter={entriesByMeter}
            progressByMeter={progressByMeter}
            meters={meters}
            schemas={schemas}
            days={days}
            colorMapping={colorMapping}
            isLoading={isLoading}
            widgets={widgets}
            width={width > 0 ? width : 100} // during tests the width is negative
          />
        )}
      </AutoSizer>
    );
  }
}

MonthlyMatrix.propTypes = {
  isLoading: PropTypes.bool,
  meters: PropTypes.arrayOf(PropTypes.object),
  widgets: PropTypes.array.isRequired,
};

MonthlyMatrix.defaultProps = {
  isLoading: false,
  year: new Date().getFullYear(),
};

export default MonthlyMatrix;
