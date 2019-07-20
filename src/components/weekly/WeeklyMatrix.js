import * as React from "react";
import PropTypes from "prop-types";
import MeterTable from "../common/MeterTable";

class WeeklyMatrix extends React.Component {
  render() {
    const {
      colorMapping,
      entries,
      meters,
      isLoading,
      days,
      widgets,
      schemas
    } = this.props;

    return (
      <MeterTable
        entries={entries}
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
  meters: PropTypes.arrayOf(PropTypes.object)
};

WeeklyMatrix.defaultProps = {
  isLoading: false
};

export default WeeklyMatrix;
