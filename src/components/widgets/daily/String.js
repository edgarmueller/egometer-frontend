import React from "react";
import { TextField } from "@material-ui/core";
import * as _ from "lodash";
import PropTypes from "prop-types";
import ConnectedComponent from "../../../components/common/ConnectedComponent";
import TitleBar from "./TitleBar";

export class DailyString extends React.Component {
  state = {
    initialized: false
  };

  render() {
    const { date, data, meter, isLoading, icon } = this.props;
    const entry = _.find(data, d => d.date === date);

    return (
      <ConnectedComponent
        meterId={meter.id}
        isLoading={isLoading}
        shouldDebounce={true}
        data={entry}
        date={date}
        updateOnChange={false}
      >
        {({ updateValue, submitEntry, data: text }) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box"
              }}
            >
              <TitleBar meter={meter} icon={icon} />
              <TextField
                variant="outlined"
                value={text}
                multiline
                rowsMax={10}
                onChange={updateValue}
                onBlur={submitEntry}
                style={{
                  flexGrow: 1
                }}
              />
            </div>
          );
        }}
      </ConnectedComponent>
    );
  }
}

DailyString.propTypes = {
  meter: PropTypes.any,
  data: PropTypes.arrayOf(PropTypes.object),
  date: PropTypes.any.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  isLoading: PropTypes.bool.isRequired
};

export default DailyString;
