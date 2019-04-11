import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import moment from "moment";
import { compose, withProps } from "recompose";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import MatrixContainer from "../../containers/MatrixContainer";
import WeeklyMatrix from "../weekly/WeeklyMatrix";
import {
  getMeters,
  getMeterError,
  getSchemaError,
  isSchemasLoading,
  isMetersLoading
} from "../../reducers";
import { findBySchemaId } from "../../utils"
import widgets from "../../widgets";
import ErrorSnackbar from "../common/ErrorSnackbar";
import * as actions from "../../actions";
import Loading from "../common/Loading";
import WeekPicker from "./WeekPicker";
import Charts from "../monthly/Charts";
import { findMonday, daysOfWeek } from "../../common/date";
import { getSchemas } from "../../reducers";

const styles = {
  monthMatrix: {
    boxSizing: "border-box",
    padding: "1em"
  }
};

export class WeeklyDashboard extends React.Component {
  constructor(props) {
    super(props);
    const now = moment();
    const { match } = props;
    const year = _.get(match, "params.year");
    const month = _.get(match, "params.month");
    this.state = {
      year: year ? Number(year) : now.year(),
      month: month ? Number(month) : now.month() + 1,
      date: findMonday(new Date()),
      days: daysOfWeek(findMonday(new Date()))
    };
  }

  componentDidMount() {
    this.props.fetchEntries(
      `${this.state.year}-${this.state.month}-${moment().date()}`
    );
  }

  findSchema = (schemaId) => {
    return findBySchemaId(this.props.schemas, schemaId)
  }

  render() {
    const {
      classes,
      fetchEntries,
      error,
      history,
      isLoading,
      meters,
      entries,
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
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <ErrorSnackbar />
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className={classes.monthMatrix}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <WeekPicker
              onChange={days => {
                this.setState({
                  days: days.map(d => {
                    d.setDate(d.getDate() + 1);
                    d.setHours(0, 0, 0, 0);
                    return d;
                  })
                });
              }}
            />
            <MatrixContainer
              date={this.state.date}
              days={this.state.days}
              headerHeight={30}
              year={this.state.year}
              month={this.state.month}
              child={WeeklyMatrix}
              findBySchemaId={this.findSchema}
              meters={meters}
              entries={entries}
              {...otherProps}
            />
          </div>
          <Charts
            isLoading={isLoading}
            days={this.state.days}
            entries={entries}
            findBySchemaId={this.findSchema}
            meters={meters}
            widgets={widgets}
            widgetType='week'
            width={window.innerWidth / 2}
          />
        </div>
      </div>
    );
  }
}

WeeklyDashboard.propTypes = {
  meters: PropTypes.array,
  widgets: PropTypes.array
};

WeeklyDashboard.defaultProps = {
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
    error: getMeterError(state) || getSchemaError(state),
    schemas: getSchemas(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchEntries(date) {
    dispatch(actions.fetchEntriesPerMonthRequest(date));
  },
  ...ownProps
});

export default compose(
  withProps({ widgets }),
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(WeeklyDashboard);
