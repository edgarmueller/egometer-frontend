import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { compose, withProps } from "recompose";
import * as _ from "lodash";

import { formatDate, parseDate } from "react-day-picker/moment";
import { connect } from "react-redux";

import { getMeters } from "../../reducers";

import Widget from "../../components/common/Widget";
import widgets from "../../widgets";
import { fetchEntriesRequest, fetchMeters } from "../../actions";
import ErrorSnackbar from "../common/ErrorSnackbar";
import { calcProgress } from "../../common/progress";
import { MeterContext } from "../../context";
import { mapDispatchToCrudMethodProps } from "../../utils/redux-mappers";
import "react-day-picker/lib/style.css";
import "./DayPicker.css";
import DayPicker from "react-day-picker";

export class DailyDashboard extends Component {
  constructor(props) {
    super(props);
    const now = moment();
    const { match } = props;
    const year = _.get(match, "params.year");
    const month = _.get(match, "params.month");
    const day = _.get(match, "params.day");
    this.state = {
      entries: props.entries,
      overscanByPixels: 0,
      windowScrollerEnabled: false,
      date:
        year && month && day
          ? moment(`${year}-${month}-${day}`, "YYYY-MM-DD")
          : moment(),
      year: year ? Number(year) : now.year(),
      month: month ? Number(month) : now.month() + 1,
      day: day ? Number(day) : now.date(),
      progress: {}
    };
  }

  calcProgress = () => {
    const { entries, meters } = this.props;
    this.setState({
      progress: calcProgress(entries, meters, [this.state.date.toDate()])
    });
  };

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.entries, prevProps.entries)) {
      this.calcProgress();
    }
  }

  componentDidMount() {
    const { year, month, day } = this.state;
    this.props.fetchEntries(`${year}-${month}-${day}`);
  }

  handleDateChange = date => {
    this.fetchEntriesByDate(moment(date));
  };

  handleMonthChange = date => {
    this.fetchEntriesByDate(moment(date));
  };

  fetchEntriesByDate = date => {
    const { history } = this.props;
    console.log("seleted date", date);
    const formattedDate = date.format("YYYY-MM-DD");
    this.setState({
      date,
      year: date.year(),
      month: date.month(),
      day: date.date()
    });
    this.props.fetchEntries(formattedDate);
    history.push(
      `/dashboard/${date.year()}/${date.month() + 1}/${date.date()}`
    );
  };

  render() {
    const { meters, entries, isLoading, updateEntry, deleteEntry } = this.props;

    // TODO: duplicate code, see month dashboard
    const meterWidgets = meters.map((meter, i) => {
      return (
        <Widget
          key={meter.id}
          id={i}
          isLoading={isLoading}
          date={this.state.date.format("YYYY-MM-DD")}
          meter={meter}
          data={_.isEmpty(entries) ? [] : entries[meter.id]}
          widgetType="day"
          progress={this.state.progress[meter.id]}
        />
      );
    });

    return (
      <div>
        <ErrorSnackbar />
        <div
          style={{ display: "flex", flexDirection: "column", padding: "1rem" }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <DayPicker
              formatDate={formatDate}
              parseDate={parseDate}
              format={"YYYY-MM-DD"}
              placeholder={`${formatDate(new Date())}`}
              value={this.state.date.format("YYYY-MM-DD")}
              onDayClick={this.handleDateChange}
              onMonthChange={this.handleMonthChange}
              month={this.state.date.toDate()}
              selectedDays={this.state.date.toDate()}
            />
            <MeterContext.Provider
              value={{
                updateEntry,
                deleteEntry
              }}
            >
              <div
                style={{
                  maxWidth: 600,
                  marginLeft: "1rem",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {meterWidgets}
              </div>
            </MeterContext.Provider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const meters = getMeters(state);
  return {
    entries: state.entries.entries,
    isLoading: state.entries.loadingStatus.isLoading,
    meters,
    widgets,
    error: state.entries.error
  };
};

const mapDispatchToProps = dispatch => ({
  ...mapDispatchToCrudMethodProps(dispatch),
  fetchEntries(date, days) {
    dispatch(fetchEntriesRequest(date, days));
  },
  fetchMeters() {
    dispatch(fetchMeters());
  }
});

DailyDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  error: PropTypes.object,
  meters: PropTypes.array,
  entries: PropTypes.object,
  isLoading: PropTypes.bool,
  updateEntry: PropTypes.func.isRequired,
  deleteEntry: PropTypes.func.isRequired
};

DailyDashboard.defaultProps = {
  meters: [],
  entries: {},
  isLoading: false
};

export default compose(
  withProps({ widgets }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DailyDashboard);
