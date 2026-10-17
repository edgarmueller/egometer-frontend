import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import EnumRenderer from "./EnumRenderer";

export class Enum extends Component {
  render() {
    const { data, date, updateEntry, deleteEntry } = this.props;

    const dailyData = _.find(data, (d) => d.date === date);
    const isSelected = (val) =>
      dailyData !== undefined ? dailyData.value === val : false;

    return (
      <EnumRenderer
        {...this.props}
        isSelected={isSelected}
        // selecting the current value again clears it
        updateEntry={(val) =>
          isSelected(val) ? deleteEntry(dailyData) : updateEntry(val)
        }
      />
    );
  }
}

Enum.propTypes = {
  date: PropTypes.string,
  data: PropTypes.array,
  updateEntry: PropTypes.func,
  deleteEntry: PropTypes.func,
};

export default Enum;
