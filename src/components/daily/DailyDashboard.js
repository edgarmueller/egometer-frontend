import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { compose, withProps } from "recompose";
import * as _ from "lodash";

import { formatDate, parseDate } from "react-day-picker/moment";
import { connect } from "react-redux";

import { getMeters, getEntriesByMeter } from "../../reducers";

import Widget from "../../components/common/Widget";
import widgets from "../../widgets";
import { fetchEntriesRequest, fetchMeters } from "../../actions";
import { MeterContext } from "../../context";
import { mapDispatchToCrudMethodProps } from "../../utils/redux-mappers";
import "react-day-picker/lib/style.css";
import "./DayPicker.css";
import DayPicker from "react-day-picker";
import { Grid } from "@material-ui/core";
import PickerLayout from "../common/PickerLayout";

export class DailyDashboard extends Component {
  constructor(props) {
    super(props);
    const now = moment();
    const { match } = props;
    const year = _.get(match, "params.year");
    const month = _.get(match, "params.month");
    const day = _.get(match, "params.day");
    this.state = {
      entriesByMeter: props.entriesByMeter,
      overscanByPixels: 0,
      windowScrollerEnabled: false,
      date:
        year && month && day
          ? moment(`${year}-${month}-${day}`, "YYYY-MM-DD")
          : moment(),
      year: year ? Number(year) : now.year(),
      month: month ? Number(month) : now.month() + 1,
      day: day ? Number(day) : now.date(),
    };
  }

  componentDidMount() {
    const { year, month } = this.state;
    this.props.fetchEntries(year, month);
  }

  handleDateChange = date => {
    this.fetchEntriesByDate(moment(date));
  };

  handleMonthChange = date => {
    this.fetchEntriesByDate(moment(date));
  };

  fetchEntriesByDate = date => {
    const { history } = this.props;
    this.setState({
      date,
      year: date.year(),
      month: date.month(),
      day: date.date()
    });
    this.props.fetchEntries(date.year(), date.month());
    history.push(
      `/dashboard/${date.year()}/${date.month() + 1}/${date.date()}`
    );
  };

  render() {
    const { meters, entriesByMeter, isLoading, updateEntry, deleteEntry } = this.props;

    return (
      <PickerLayout
        picker={
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
        }
      >
        <MeterContext.Provider
          value={{
            updateEntry,
            deleteEntry
          }}
        >
          <Grid container spacing={2} direction="column">
            {meters.map((meter, i) => (
              <Grid item key={meter.id}>
                <div
                  style={{
                    marginLeft: "2rem",
                    marginRight: "2rem"
                  }}
                >
                  <Widget
                    key={meter.id}
                    id={meter.id}
                    isLoading={isLoading}
                    date={this.state.date.format("YYYY-MM-DD")}
                    meter={meter}
                    data={_.isEmpty(entriesByMeter) ? [] : entriesByMeter[meter.id]}
                    widgetType="day"
                  />
                </div>
              </Grid>
            ))}
          </Grid>
        </MeterContext.Provider>
      </PickerLayout>
    );
  }
}

const mapStateToProps = state => {
  const meters = getMeters(state);
  return {
    entriesByMeter: getEntriesByMeter(state),
    isLoading: state.entries.loadingStatus.isLoading,
    meters,
    widgets,
    error: state.entries.error
  };
};

const mapDispatchToProps = dispatch => ({
  ...mapDispatchToCrudMethodProps(dispatch),
  fetchEntries(year, month) {
    dispatch(fetchEntriesRequest(year, month));
  },
  fetchMeters() {
    dispatch(fetchMeters());
  }
});

DailyDashboard.propTypes = {
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
  connect(mapStateToProps, mapDispatchToProps)
)(DailyDashboard);
