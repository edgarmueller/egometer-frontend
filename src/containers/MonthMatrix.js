import { connect } from "react-redux";
import { compose, withProps } from "recompose";
import React from "react";
import { AutoSizer } from "react-virtualized";
import widgets from "../widgets";
import { updateEntryRequest } from "../actions";
import MonthMatrix from "../components/monthly/MonthMatrix";
import { getMeters } from "../reducers";
import Charts from "../components/monthly/Charts";

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

class MonthMatrixContainer extends React.Component {
  width;
  render() {
    const { meters, findBySchemaId, entries, isLoading } = this.props;
    const colorMapping = meters.reduce((acc, m) => {
      acc[m.name] = m.color;
      return acc;
    }, {});
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const days = daysInMonth(year, month);
    return (
      <React.Fragment>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <AutoSizer disableHeight defaultHeight={768} defaultWidth={1024}>
            {({ width }) => {
              return (
                <React.Fragment>
                  <MonthMatrix
                    {...this.props}
                    colorMapping={colorMapping}
                    width={width}
                  />
                </React.Fragment>
              );
            }}
          </AutoSizer>
        </div>
        <Charts
          isLoading={isLoading}
          days={days}
          entries={entries}
          findBySchemaId={findBySchemaId}
          meters={meters}
          widgets={widgets}
          width={window.innerWidth / 2}
        />
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

export default compose(
  withProps({ widgets }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MonthMatrixContainer);
