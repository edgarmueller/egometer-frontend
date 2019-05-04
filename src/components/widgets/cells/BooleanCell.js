import * as React from "react";
import ConnectedComponent from "../../../components/common/ConnectedComponent";
import Checkbox from "@material-ui/core/Checkbox";
import RadioButtonUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import CheckCircle from "@material-ui/icons/CheckCircle";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
  checkbox: {
    width: "100%",
    height: "100%",
    maxWidth: 30,
    maxHeight: 27,
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: "rgb(65, 102, 170, 0.5)",
      color: "#fff"
    },
  }
};

const BooleanCell = ({
  classes,
  color,
  isLoading,
  data,
  hover,
  updateEntry
}) => (
    <ConnectedComponent
      isLoading={isLoading}
      data={data}
      updateEntry={updateEntry}
      fromEvent={ev => {
        return ev.target.checked;
      }}
    >
      {({ handleOnChange, data }) => {
        return (
          <div className={classes.checkbox} style={{ backgroundColor: color }}>
            <Checkbox
              icon={
                hover ? (
                  <RadioButtonUnchecked style={{ color: "#fff" }} />
                ) : (<span />)
              }
              checkedIcon={<CheckCircle />}
              checked={data}
              onChange={ev => handleOnChange(ev)}
            />
          </div>
        );
      }}
    </ConnectedComponent>
  );

export default withStyles(styles)(BooleanCell);
