import React from "react";
import * as _ from "lodash";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ConnectedComponent from "../../common/ConnectedComponent";
import { meterTitle, underline } from "../../../common/styles";
import { TextField } from "@material-ui/core";
import TitleBar from "./TitleBar";

const styles = {
  textArea: {
    marginRight: 10,
    padding: 10,
    flexGrow: 1,
    resize: "none",
    border: "none",
    fontFamily: `'Oxygen', sans-serif`,
    fontSize: 20,
    color: "#000",
    backgroundColor: "#f6f7f9",
    borderRadius: "4px"
  },
  underline,
  meterTitle
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export const DailyNumber = ({ date, data, meter, isLoading, icon }) => {
  const journalEntry = _.find(data, d => d.date === date);
  return (
    <ConnectedComponent
      meterId={meter.id}
      fromEvent={ev => {
        const val = ev.target.value;
        const isNumber = isNumeric(val);
        return isNumber ? _.toNumber(val) : val;
      }}
      isLoading={isLoading}
      data={(journalEntry && journalEntry.value) || undefined}
      date={date}
      updateOnChange
    >
      {({ handleOnChange, handleOnBlur, data: number }) => {
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
              type="number"
              variant="outlined"
              value={number}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              inputProps={{
                pattern: "[0-9]+([.,][0-9]+)?"
              }}
            />
          </div>
        );
      }}
    </ConnectedComponent>
  );
};

DailyNumber.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  date: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  updateEntry: PropTypes.func.isRequired
};

export default withStyles(styles)(DailyNumber);
