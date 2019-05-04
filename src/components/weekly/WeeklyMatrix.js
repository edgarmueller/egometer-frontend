import * as React from "react";
import PropTypes from "prop-types";
import MeterTable from '../common/MeterTable';

class WeeklyMatrix extends React.Component {

  render() {
    const {
      colorMapping,
      entries,
      meters,
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
  widgets: PropTypes.array.isRequired
};

WeeklyMatrix.defaultProps = {
  isLoading: false,
};

export default WeeklyMatrix;
