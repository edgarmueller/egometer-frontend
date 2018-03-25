import React, { Component } from "react";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import EnumRenderer from "./EnumRenderer";

const styles = {};

export class Enum extends Component {
  render() {
    const { data, date, updateEntry } = this.props;

    const dailyData = _.find(data, d => d.date === date);
    const isSelected = val =>
      dailyData !== undefined ? dailyData.value === val : false;

    return (
      <EnumRenderer
        {...this.props}
        isSelected={isSelected}
        updateEntry={val => updateEntry(val)}
      />
    );
  }
}

export default withStyles(styles)(Enum);
