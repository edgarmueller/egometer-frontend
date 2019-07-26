import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { compose, withProps } from "recompose";
import * as _ from "lodash";
import DayPickerInput from "react-day-picker/DayPickerInput";

import "react-day-picker/lib/style.css";
import { formatDate, parseDate } from "react-day-picker/moment";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import { getMeters } from "../../reducers";

import Widget from "../../components/common/Widget";
import widgets from "../../widgets";
import { fetchEntriesRequest, fetchMeters } from "../../actions";
import ErrorSnackbar from "../common/ErrorSnackbar";
import { calcProgress } from "../../common/progress";
import { MeterContext } from "../../context";
import { mapDispatchToCrudMethodProps } from "../../utils/redux-mappers";

const styles = {
  display1: {
    marginTop: "0.5em",
    fontFamily: `'Oxygen', sans-serif`,
    color: "#000",
    marginBottom: 20,
    fontWeight: "bold"
  },
  paper: {
    marginTop: "1em",
    paddingLeft: "10px",
    paddingRight: "10px",
    maxWidth: "1200px",
    margin: "auto"
  },
  button: {
    marginBottom: "0.5em"
  }
};

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
      focused: false,
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

  handleDateChange = day => {
    const date = moment(day);
    const { history } = this.props;
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
    const {
      classes,
      meters,
      entries,
      isLoading,
      updateEntry,
      deleteEntry
    } = this.props;

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
      <MeterContext.Provider
        value={{
          updateEntry,
          deleteEntry
        }}
      >
        <div
          style={{
            width: "80%",
            height: "100%",
            margin: "0 auto"
          }}
          id={"dashboard"}
        >
          <div className={classes.paper}>
            <span>Selected date is &nbsp;</span>
            <DayPickerInput
              formatDate={formatDate}
              parseDate={parseDate}
              format={"YYYY-MM-DD"}
              placeholder={`${formatDate(new Date())}`}
              value={this.state.date.format("YYYY-MM-DD")}
              isOutsideRange={() => false}
              onDayChange={this.handleDateChange}
              focused={this.state.focused}
              onFocusChange={({ focused }) => this.setState({ focused })}
              block={false}
              small={true}
            />
          </div>
          <ErrorSnackbar />
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {meterWidgets}
          </div>
        </div>
      </MeterContext.Provider>
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
  ),
  withStyles(styles)
)(DailyDashboard);
