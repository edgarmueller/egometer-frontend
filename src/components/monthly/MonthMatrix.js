import * as React from "react";
import { AutoSizer } from "react-virtualized";
import PropTypes from "prop-types";
import MeterTable from "../common/MeterTable";

class MonthMatrix extends React.Component {

  render() {
    const {
      meters,
      days,
      entries,
      findBySchemaId,
      year,
      colorMapping,
      month,
      updateEntry,
      isLoading,
      widgets
    } = this.props;

    return (
      <AutoSizer disableHeight defaultHeight={768} defaultWidth={1024}>
        {({ width }) => (
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
            width={width > 0 ? width : 100} // during tests the width is negative
          />
        )}
      </AutoSizer>
    );
  }
}

MonthMatrix.propTypes = {
  isLoading: PropTypes.bool,
  updateEntry: PropTypes.func.isRequired,
  meters: PropTypes.arrayOf(PropTypes.object),
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  widgets: PropTypes.array.isRequired
};

MonthMatrix.defaultProps = {
  isLoading: false,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
};

export default MonthMatrix;
