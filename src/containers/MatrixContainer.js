import { connect } from "react-redux";
import { compose, withProps } from "recompose";
import React from "react";
import PropTypes from "prop-types";
import widgets from "../widgets";
import { updateEntryRequest } from "../actions";
import { getMeters } from "../reducers";
import Charts from "../components/monthly/Charts";

class MatrixContainer extends React.Component {
  width;
  render() {
    const {
      meters,
      findBySchemaId,
      entries,
      isLoading,
      days,
      child
    } = this.props;
    const colorMapping = meters.reduce((acc, m) => {
      acc[m.name] = m.color;
      return acc;
    }, {});
    const Child = child;
    return (
      <React.Fragment>
        <Child {...this.props} colorMapping={colorMapping} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const meters = getMeters(state);

  return {
    entries: ownProps.entries,
    isLoading: state.entries.loadingStatus.isLoading,
    meters
  };
};

const mapDispatchToProps = dispatch => ({
  updateEntry: (meterId, date) => (value, shouldDebounce) => {
    return dispatch(
      updateEntryRequest(
        {
          meterId,
          date,
          value
        },
        shouldDebounce
      )
    );
  }
});

MatrixContainer.propTypes = {
  days: PropTypes.array.isRequired
};

export default compose(
  withProps({ widgets }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MatrixContainer);
