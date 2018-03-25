import React, { Component } from "react";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import EnumRenderer from "./EnumRenderer";

const styles = {};

export class MultiEnum extends Component {
  render() {
    const { data, date, schema, updateEntry } = this.props;

    if (schema === undefined) {
      return null;
    }

    const dailyData = _.find(data, d => d.date === date);
    const isSelected = val =>
      dailyData !== undefined ? dailyData.value.indexOf(val) !== -1 : false;
    const updateMulti = val => {
      if (dailyData === undefined) {
        updateEntry([val]);
      } else {
        if (dailyData.value.indexOf(val) === -1) {
          updateEntry(dailyData.value.concat([val]));
        } else {
          updateEntry(dailyData.value.filter(x => x !== val));
        }
      }
    };

    return (
      <EnumRenderer
        {...this.props}
        schema={schema.items}
        isSelected={isSelected}
        updateEntry={updateMulti}
      />
    );
  }
}

export default withStyles(styles)(MultiEnum);
