import * as React from "react";
import PropTypes from "prop-types";
import MeterTable from '../common/MeterTable';

class WeeklyMatrix extends React.PureComponent {

  render() {
    const {
      colorMapping,
      entries,
      meters,
      month,
      year,
      widgets,
      isLoading,
      days,
      updateEntry,
      findBySchemaId
    } = this.props;

    return (
      <MeterTable
        entries={entries}
        meters={meters}
        findBySchemaId={findBySchemaId}
        month={month}
        year={year}
        days={days}
        colorMapping={colorMapping}
        updateEntry={updateEntry}
        isLoading={isLoading}
        widgets={widgets}
        width={768}
      />
    );
  }
}

WeeklyMatrix.propTypes = {
  isLoading: PropTypes.bool,
  updateEntry: PropTypes.func.isRequired,
  meters: PropTypes.arrayOf(PropTypes.object),
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  widgets: PropTypes.array.isRequired
};

WeeklyMatrix.defaultProps = {
  isLoading: false,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
};

export default WeeklyMatrix;
