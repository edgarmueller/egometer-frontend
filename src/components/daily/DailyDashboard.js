import React, { Component } from "react";
import AddIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";
import moment from "moment";
import { compose, withProps } from "recompose";
import * as _ from "lodash";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";

import { getMeters } from "../../reducers";

import Widget from "../../components/common/Widget";
import GridLayout from "../common/GridLayout";
import widgets from "../../widgets";
import { fetchEntriesPerMonthRequest, fetchMeters } from "../../actions";
import UpdateEntryErrorSnackbar from "../common/UpdateEntryErrorSnackbar";
import AddMeterDialog from "./AddMeterDialog";

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
    this.state = {
      date: moment(),
      entries: props.entries,
      focused: false,
      overscanByPixels: 0,
      windowScrollerEnabled: false
    };
  }

  handleDateChange = date => {
    const formattedDate = date.format("YYYY-MM-DD");
    this.setState({ date });
    this.props.fetchEntries(formattedDate);
  };

  handleClick = () => {
    this.openDialog();
  };

  openDialog = () => {
    this.setState({ open: true });
  };

  closeDialog = () => {
    this.setState({ open: false });
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
          <div>
            <span>Selected date is &nbsp;</span>
            <SingleDatePicker
              isOutsideRange={() => false}
              date={this.state.date}
              onDateChange={this.handleDateChange}
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
          <div className={classes.button}>
            <Button variant="fab" onClick={this.handleClick}>
              <AddIcon />
            </Button>
          </div>
          <AddMeterDialog
            open={this.state.open}
            onSubmit={() => {
              this.closeDialog();
              this.props.fetchMeters();
            }}
            handleClose={this.closeDialog}
            widgets={widgets}
          />
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