import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import "react-dates/initialize";
import MonthPickerInput from "react-month-picker-input";
import "../../react-month-picker-input.css";

import { compose, withProps } from "recompose";
import PropTypes from "prop-types";
import "react-dates/lib/css/_datepicker.css";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import MonthMatrix from "../../containers/MonthMatrix";
import {
  getMeters,
  getMeterError,
  getSchemaError,
  findMeterById as _findMeterById,
  findBySchemaId as _findBySchemaId
} from "../../reducers";
import widgets from "../../widgets";
import UpdateEntryErrorSnackbar from "../common/UpdateEntryErrorSnackbar";
import * as actions from "../../actions";

const styles = {
  monthMatrix: {
    boxSizing: "border-box",
    width: "100%",
    padding: "1em"
  }
};

export class MonthDashboard extends React.Component {
  constructor(props) {
    super(props);
    const now = moment();
    this.state = {
      entries: props.entries || undefined,
      focused: false,
      overscanByPixels: 0,
      windowScrollerEnabled: false,
      year: now.year(),
      month: now.month() + 1,
      metersWithWidgets: []
    };
  }

  render() {
    const { classes, fetchEntries, ...otherProps } = this.props;

    if (this.props.error) {
      return (
        <div>
          <Typography variant="display1">MONTH</Typography>
          <div>{this.props.error}</div>
        </div>
      );
    }

    return (
      <div>
        <UpdateEntryErrorSnackbar />
        <div id={"dashboard"} className={classes.monthMatrix}>
          <MonthPickerInput
            inputProps={{
              style: {
                border: "1px solid black",
                borderRadius: "2px",
                textAlign: "center",
                lineHeight: 1.5
              }
            }}
            year={this.state.year}
            month={this.state.month - 1}
            onChange={(maskedValue, selectedYear, selectedMonth) => {
              this.setState({
                year: selectedYear,
                month: selectedMonth + 1
              });
              fetchEntries(
                `${selectedYear}-${selectedMonth + 1}-${moment().date()}`
              );
            }}
            closeOnSelect={true}
          />
          <MonthMatrix
            headerHeight={30}
            year={this.state.year}
            month={this.state.month}
            {...otherProps}
          />
        </div>
      </div>
    );
  }
}

MonthDashboard.propTypes = {
  meters: PropTypes.array,
  widgets: PropTypes.array
};

MonthDashboard.defaultProps = {
  meters: [],
  widgets: []
};

const mapStateToProps = state => ({
  meters: getMeters(state),
  entries: state.entries.entries,
  findMeterById(meterId) {
    return _findMeterById(meterId)(state);
  },
  error: getMeterError(state) || getSchemaError(state),
  findBySchemaId(schemaId) {
    const foundSchema = _findBySchemaId(schemaId)(state);
    if (foundSchema !== undefined) {
      return foundSchema.schema;
    }
    return undefined;
  }
});

const mapDispatchToProps = dispatch => ({
  fetchEntries(date) {
    dispatch(actions.fetchEntriesPerMonthRequest(date));
  }
});

export default compose(
  withProps({ widgets }),
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MonthDashboard);
