import React from "react";
import moment from "moment";
import DayPicker from "react-day-picker";
import PropTypes from "prop-types";
import "react-day-picker/lib/style.css";
import "./WeekPicker.css";

function getWeekDays(weekStart) {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push(moment(weekStart).add(i, "days").toDate());
  }
  return days;
}

function getWeekRange(date) {
  return {
    from: moment(date).startOf("isoWeek").toDate(),
    to: moment(date).endOf("isoWeek").toDate(),
  };
}

export default class WeekPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverRange: undefined,
      selectedDays: getWeekDays(getWeekRange(this.props.date).from),
    };
  }

  handleDayChange = (date) => {
    const selectedDays = getWeekDays(getWeekRange(date).from);
    this.setState({ selectedDays });
    this.props.onChange(selectedDays);
  };

  handleDayEnter = (date) => {
    this.setState({
      hoverRange: getWeekRange(date),
    });
  };

  handleDayLeave = () => {
    this.setState({
      hoverRange: undefined,
    });
  };

  handleWeekClick = (weekNumber, days) => {
    this.setState({
      selectedDays: days,
    });
  };

  render() {
    const { hoverRange, selectedDays } = this.state;
    const daysAreSelected = selectedDays.length > 0;

    const modifiers = {
      hoverRange,
      selectedRange: daysAreSelected && {
        from: selectedDays[0],
        to: selectedDays[6],
      },
      hoverRangeStart: hoverRange && hoverRange.from,
      hoverRangeEnd: hoverRange && hoverRange.to,
      selectedRangeStart: daysAreSelected && selectedDays[0],
      selectedRangeEnd: daysAreSelected && selectedDays[6],
    };

    return (
      <div className="SelectedWeekExample">
        <DayPicker
          selectedDays={selectedDays}
          month={this.props.date}
          showWeekNumbers
          showOutsideDays
          modifiers={modifiers}
          onDayClick={this.handleDayChange}
          onDayMouseEnter={this.handleDayEnter}
          onDayMouseLeave={this.handleDayLeave}
          onWeekClick={this.handleWeekClick}
        />
        {selectedDays.length === 7 && (
          <div>
            {moment(selectedDays[0]).format("LL")} –{" "}
            {moment(selectedDays[6]).format("LL")}
          </div>
        )}
      </div>
    );
  }
}

WeekPicker.propTypes = {
  date: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
};
