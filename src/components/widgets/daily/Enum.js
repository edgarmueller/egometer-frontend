import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import EnumRenderer from "./EnumRenderer";

export class Enum extends Component {
  render() {
    const { data, date, updateEntry } = this.props;

    const dailyData = _.find(data, (d) => d.date === date);
    const isSelected = (val) =>
      dailyData !== undefined ? dailyData.value === val : false;

    return (
      <EnumRenderer
        {...this.props}
        isSelected={isSelected}
        updateEntry={(val) => updateEntry(val)}
      />
    );
  }
}

Enum.propTypes = {
  date: PropTypes.string,
  data: PropTypes.string,
  updateEntry: PropTypes.func,
};

export default Enum;
