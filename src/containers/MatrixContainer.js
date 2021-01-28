import { connect } from "react-redux";
import { compose, withProps } from "recompose";
import React from "react";
import PropTypes from "prop-types";
import widgets from "../widgets";
import { getMeters } from "../reducers";
import { MeterContext } from "../context";
import { mapDispatchToCrudMethodProps } from "../utils/redux-mappers";

export class MatrixContainer extends React.Component {
  render() {
    const { days, meters, child, schemas, entriesByMeter } = this.props;
    const { widgets, deleteEntry, updateEntry } = this.props;
    const colorMapping = meters.reduce((acc, m) => {
      acc[m.name] = m.color;
      return acc;
    }, {});
    const Child = child;
    return (
      <MeterContext.Provider
        value={{
          updateEntry,
          deleteEntry,
        }}
      >
        <Child
          widgets={widgets}
          entriesByMeter={entriesByMeter}
          days={days}
          meters={meters}
          schemas={schemas}
          colorMapping={colorMapping}
        />
      </MeterContext.Provider>
    );
  }
}

const mapStateToProps = (state) => {
  const meters = getMeters(state);

  return {
    isLoading: state.entries.loadingStatus.isLoading,
    meters,
  };
};

MatrixContainer.propTypes = {
  meters: PropTypes.array,
  days: PropTypes.array.isRequired,
  deleteEntry: PropTypes.func,
  updateEntry: PropTypes.func,
  widgets: PropTypes.array,
  schemas: PropTypes.array,
  entriesByMeter: PropTypes.object,
  child: PropTypes.any,
};

export default compose(
  withProps({ widgets }),
  connect(mapStateToProps, mapDispatchToCrudMethodProps)
)(MatrixContainer);
