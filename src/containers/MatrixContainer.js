import { connect } from "react-redux";
import { compose, withProps } from "recompose";
import React from "react";
import PropTypes from "prop-types";
import widgets from "../widgets";
import { deleteEntryRequest, updateEntryRequest } from "../actions";
import { getMeters } from "../reducers";
import { MeterContext } from "../context";
import { mapDispatchToCrudMethodProps } from "../utils/redux-mappers";

export class MatrixContainer extends React.Component {
  render() {
    const { days, meters, child, schemas, entries } = this.props;
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
          deleteEntry
        }}
      >
        <Child
          widgets={widgets}
          entries={entries}
          days={days}
          meters={meters}
          schemas={schemas}
          colorMapping={colorMapping}
        />
      </MeterContext.Provider>
    );
  }
}

const mapStateToProps = state => {
  const meters = getMeters(state);

  return {
    isLoading: state.entries.loadingStatus.isLoading,
    meters
  };
};

MatrixContainer.propTypes = {
  // TODO: schemas, meters
  //const { meters, child, schemas, entries } = this.props;
  //const { widgets, deleteEntry, updateEntry } = this.props;
  days: PropTypes.array.isRequired
};

export default compose(
  withProps({ widgets }),
  connect(
    mapStateToProps,
    mapDispatchToCrudMethodProps
  )
)(MatrixContainer);
