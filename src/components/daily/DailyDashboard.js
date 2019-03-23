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
import GridLayout from "../common/GridLayout";
import widgets from "../../widgets";
import { fetchEntriesPerMonthRequest, fetchMeters } from "../../actions";
import UpdateEntryErrorSnackbar from "../common/UpdateEntryErrorSnackbar";

const Wrapper = ({ children, ...props }) => {
  const newChildren = React.Children.map(children, child => {
    return React.cloneElement(child, {
      width: props.style.width,
      height: props.style.height
    });
  });
  return <div {...props}>{newChildren}</div>;
};

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
      day: day ? Number(day) : now.date()
    };
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
    const { classes, meters, entries, isLoading, widgets } = this.props;

    // TODO: duplicate code, see month dashboard
    const meterWidgets = meters.map((meter, i) => {
      return (
        <Wrapper key={i}>
          <Widget
            id={i}
            isLoading={isLoading}
            date={this.state.date.format("YYYY-MM-DD")}
            meter={meter}
            data={_.isEmpty(entries) ? [] : entries[meter.id]}
            widgetType="day"
          />
        </Wrapper>
      );
    });
    const widgetsInUse = meters
      .map(meter => widgets.find(widget => widget.name === meter.widget))
      .filter(vis => vis !== undefined);

    return (
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
            //onDateChange={this.handleDateChange}
            onDayChange={this.handleDateChange}
            focused={this.state.focused}
            onFocusChange={({ focused }) => this.setState({ focused })}
            block={false}
            small={true}
          />
        </div>
        <UpdateEntryErrorSnackbar />
        <div>
          <GridLayout items={widgetsInUse.map(v => ({ h: v.h, w: v.w }))}>
            {meterWidgets}
          </GridLayout>
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
  fetchEntries(date) {
    dispatch(fetchEntriesPerMonthRequest(date));
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
  isLoading: PropTypes.bool
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
