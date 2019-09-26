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

const Boolean = ({ meter, date, data, isLoading, icon }) => {
  const entry = _.find(data, d => d.date === date);

  return (
    <ConnectedComponent
      meterId={meter.id}
      isLoading={isLoading}
      data={entry}
      date={date}
      updateOnChange
      fromEvent={x => x}
    >
      {({ updateValue, data: checked }) => {
        return (
          <div>
            <TitleBar meter={meter} icon={icon} />
            <Switch
              checked={checked || false}
              onChange={(ev, value) => updateValue(value)}
            />
          </div>
        );
      }}
    </ConnectedComponent>
  );
};

Boolean.propTypes = {
  meter: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  updateEntry: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  icon: PropTypes.node
};

Boolean.defaultProps = {
  icon: null
};

export default withStyles(styles)(Boolean);
