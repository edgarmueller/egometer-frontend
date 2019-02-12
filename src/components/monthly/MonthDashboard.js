import React from "react";
import _ from "lodash";
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
  findBySchemaId as _findBySchemaId,
  isSchemasLoading,
  isMetersLoading
} from "../../reducers";
import widgets from "../../widgets";
import UpdateEntryErrorSnackbar from "../common/UpdateEntryErrorSnackbar";
import * as actions from "../../actions";
import Loading from "../common/Loading";

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
    const { match } = props;
    const year = _.get(match, "params.year");
    const month = _.get(match, "params.month");
    this.state = {
      year: year ? Number(year) : now.year(),
      month: month ? Number(month) : now.month() + 1
    };
  }

  render() {
    const {
      classes,
      fetchEntries,
      error,
      history,
      isLoading,
      ...otherProps
    } = this.props;

    console.log("isLoading", isLoading);

    if (error) {
      return (
        <div>
          <Typography variant="display1">MONTH</Typography>
          <div>{this.props.error}</div>
        </div>
      );
    }

    if (isLoading) {
      return <Loading />;
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
              fetchEntries(
                `${selectedYear}-${selectedMonth + 1}-${moment().date()}`
              );
              history.push(`/matrix/${selectedYear}/${selectedMonth + 1}`);
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
  isLoading:
    state.entries.loadingStatus.isLoading ||
    isMetersLoading(state) ||
    isSchemasLoading(state),
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
