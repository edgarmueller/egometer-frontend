import React, { Component } from "react";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import EnumRenderer from "./EnumRenderer";

const styles = {};

export class MultiEnum extends Component {
  updateMulti = (val) => {
    const { updateEntry, data, date } = this.props;
    const dailyData = _.find(data, (d) => d.date === date);
    if (dailyData === undefined) {
      updateEntry([val]);
    } else {
      if (dailyData.value.indexOf(val) === -1) {
        updateEntry(dailyData.value.concat([val]));
      } else {
        updateEntry(dailyData.value.filter((x) => x !== val));
      }
    }
  };

  isSelected = (val) => {
    const { date, data } = this.props;
    const dailyData = _.find(data, (d) => d.date === date);
    return dailyData !== undefined
      ? dailyData.value.indexOf(val) !== -1
      : false;
  };

  render() {
    const { schema } = this.props;

    if (schema === undefined) {
      return null;
    }

    return (
      <EnumRenderer
        {...this.props}
        schema={schema.items}
        isSelected={this.isSelected}
        updateEntry={this.updateMulti}
      />
    );
  }
}

MultiEnum.propTypes = {
  schema: PropTypes.object,
  date: PropTypes.string,
  data: PropTypes.any,
  updateEntry: PropTypes.func,
};

export default withStyles(styles)(MultiEnum);
