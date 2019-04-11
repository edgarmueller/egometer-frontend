import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import moment from "moment";
import MonthPickerInput from "react-month-picker-input";
import "../../react-month-picker-input.css";
import { compose, withProps } from "recompose";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import MonthMatrix from "./MonthMatrix";
import {
  getMeters,
  getMeterError,
  getSchemaError,
  isSchemasLoading,
  isMetersLoading
} from "../../reducers";
import widgets from "../../widgets";
import ErrorSnackbar from "../common/ErrorSnackbar";
import * as actions from "../../actions";
import Loading from "../common/Loading";
import MatrixContainer from "../../containers/MatrixContainer";
import { daysOfMonth } from "../../common/date";
import { findBySchemaId } from "../../utils";
import { getSchemas } from "../../reducers";
import Charts from "./Charts";

const styles = {
  monthMatrix: {
    boxSizing: "border-box",
    width: "100%",
    padding: "1em"
  }
};

export class MonthlyDashboard extends React.Component {
  constructor(props) {
    super(props);
    const now = moment();
    const { match } = props;
    const matchedYear = _.get(match, "params.year");
    const matchedMonth = _.get(match, "params.month");
    const year = matchedYear ? Number(matchedYear) : now.year();
    const month = matchedMonth ? Number(matchedMonth) : now.month() + 1;
    this.state = {
      year,
      month
    };
  }

  componentDidMount() {
    this.props.fetchEntries(
      `${this.state.year}-${this.state.month}-${moment().date()}`
    );
  }

  findSchema = schemaId => {
    return findBySchemaId(this.props.schemas, schemaId);
  };

  render() {
    const {
      classes,
      fetchEntries,
      error,
      history,
      isLoading,
      entries,
      meters,
      ...otherProps
    } = this.props;

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
        <ErrorSnackbar />
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
          <MatrixContainer
            days={daysOfMonth(this.state.year, this.state.month)}
            year={this.state.year}
            month={this.state.month}
            child={MonthMatrix}
            findBySchemaId={this.findSchema}
            meters={meters}
            entries={entries}
            schemas={otherProps.schemas}
            {...otherProps}
          />
          <Charts
            isLoading={isLoading}
            days={daysOfMonth(this.state.year, this.state.month)}
            entries={entries}
            findBySchemaId={this.findSchema}
            meters={meters}
            widgets={widgets}
            widgetType="month"
            width={window.innerWidth / 2}
          />
        </div>
      </div>
    );
  }
}

MonthlyDashboard.propTypes = {
  meters: PropTypes.array,
  widgets: PropTypes.array
};

MonthlyDashboard.defaultProps = {
  meters: [],
  widgets: []
};

const mapStateToProps = state => {
  return {
    isLoading:
      state.entries.loadingStatus.isLoading ||
      isMetersLoading(state) ||
      isSchemasLoading(state),
    meters: getMeters(state),
    entries: state.entries.entries,
    schemas: getSchemas(state),
    error: getMeterError(state) || getSchemaError(state)
  };
};

const mapDispatchToProps = dispatch => ({
  fetchEntries(date) {
    dispatch(actions.fetchEntriesPerMonthRequest(date));
  }
});

MonthlyDashboard.propTypes = {
  fetchEntries: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  meters: PropTypes.array.isRequired,
  entries: PropTypes.object.isRequired,
  schemas: PropTypes.array.isRequired,
  error: PropTypes.string
};

MonthlyDashboard.defaultProps = {
  error: undefined
};

export default compose(
  withProps({ widgets }),
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MonthlyDashboard);
