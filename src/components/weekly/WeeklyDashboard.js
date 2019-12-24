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
  isMetersLoading,
  getEntriesByMeter,
  getProgressByMeter
} from "../../reducers";
import { findBySchemaId } from "../../utils";
import widgets from "../../widgets";
import * as actions from "../../actions";
import Loading from "../common/Loading";
import WeekPicker from "./WeekPicker";
import Charts from "../monthly/Charts";
import {
  daysOfWeek,
  getWeek,
  weekToDate,
  getCurrentWeek
} from "../../common/date";
import { getSchemas } from "../../reducers";
import PickerLayout from "../common/PickerLayout";

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
    const week = _.get(match, "params.week");
    const month = week && weekToDate(week).getMonth() + 1;
    const w = week || getCurrentWeek();
    const m = month || weekToDate(w).getMonth() + 1;
    this.state = {
      date: weekToDate(w),
      year: year ? Number(year) : now.year(),
      month: m,
      days: daysOfWeek(weekToDate(w)),
      week: w,
      mounted: false
    };
  }

  componentDidUpdate(prevProps) {
    const { entriesByMeter: prevEntriesByMeter } = prevProps;
    const { entriesByMeter } = this.props;
    if (!_.isEqual(entriesByMeter, prevEntriesByMeter)) {
      this.props.fetchEntries(this.state.year, this.state.week);
    }
  }

  componentDidMount() {
    const { date } = this.state;
    this.props.fetchEntries(date.getFullYear(), this.state.week);
    this.setState({ mounted: true });
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
      meters,
      entriesByMeter,
      progressByMeter,
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

    if (isLoading && !this.state.mounted) {
      return <Loading />;
    }

    return (
      <PickerLayout
        picker={
          <WeekPicker
            date={this.state.date}
            onChange={days => {
              const week = getWeek(days[0]);
              const year = days[0].getFullYear();
              const month = days[0].getMonth() + 1;
              // TODO: we do not fetch each time
              fetchEntries(year, week);
              // TODO: can we just update the URL without reloading?
              history.push(`/weekly/${year}/${week}`);
            }}
          />
        }
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <MatrixContainer
            date={this.state.date}
            days={this.state.days}
            headerHeight={30}
            year={this.state.year}
            month={this.state.month}
            child={WeeklyMatrix}
            meters={meters}
            entriesByMeter={entriesByMeter}
            progressByMeter={progressByMeter}
            {...otherProps}
          />
        </div>
        <Charts
          isLoading={isLoading}
          days={this.state.days}
          entries={entriesByMeter}
          findBySchemaId={this.findSchema}
          meters={meters}
          widgets={widgets}
          widgetType="week"
          width={window.innerWidth / 2}
        />
      </PickerLayout>
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
    entriesByMeter: getEntriesByMeter(state),
    progressByMeter: getProgressByMeter(state),
    error: getMeterError(state) || getSchemaError(state),
    schemas: getSchemas(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchEntries(date, week) {
    dispatch(actions.fetchEntriesRequestByWeek(date, week));
  },
  ...ownProps
});

export default compose(
  withProps({ widgets }),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(WeeklyDashboard);
