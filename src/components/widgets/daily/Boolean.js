import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";
import ConnectedComponent from "../../common/ConnectedComponent";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import TitleBar from "./TitleBar";
import { meterTitle, underline } from "../../../common/styles";

const styles = {
  meterTitle,
  underline
};

const DailyBoolean = ({ meter, date, data, updateEntry, isLoading, icon }) => {
  const booleanEntry = _.find(data, d => d.date === date);

  return (
    <ConnectedComponent
      isLoading={isLoading}
      data={(booleanEntry && booleanEntry.value) || false}
      updateOnChange
      // TODO: this should be probably be the default?
      fromEvent={x => x}
      updateEntry={updateEntry}
      inputComponent={({ handleOnChange, data: checked }) => {
        return (
          <div>
            <TitleBar meter={meter} icon={icon} />
            <Switch
              checked={checked}
              onChange={(ev, value) => handleOnChange(value)}
            />
          </div>
        );
      }}
    />
  );
};

DailyBoolean.propTypes = {
  meter: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  updateEntry: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  icon: PropTypes.node
};

DailyBoolean.defaultProps = {
  icon: null
};

export default withStyles(styles)(DailyBoolean);
