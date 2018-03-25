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
    const { date, data, meter, updateEntry, isLoading, icon } = this.props;

    const journalEntry = _.find(data, d => d.date === date);

    return (
      <ConnectedComponent
        isLoading={isLoading}
        shouldDebounce={true}
        data={(journalEntry && journalEntry.value) || undefined}
        date={date}
        updateOnChange
        updateEntry={updateEntry}
        inputComponent={({ handleOnChange, data: text }) => {
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
                onChange={handleOnChange}
                style={{
                  flexGrow: 1
                }}
              />
            </div>
          );
        }}
      />
    );
  }
}

DailyString.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  date: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  updateEntry: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default DailyString;
