import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import CheckCircle from "@material-ui/icons/CheckCircle";
import withStyles from "@material-ui/core/styles/withStyles";
import ConnectedComponent from "../../../components/common/ConnectedComponent";
import PropTypes from "prop-types";

const styles = {
  checkbox: {
    width: "100%",
    height: "100%",
    maxWidth: 30,
    maxHeight: 27,
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
  },
};

const NoPaddingCheckbox = withStyles({
  root: {
    width: "27px",
  },
})(Checkbox);

const BooleanCell = ({
  meterId,
  classes,
  color,
  isLoading,
  date,
  data,
  style,
}) => {
  return (
    <ConnectedComponent
      date={date}
      isLoading={isLoading}
      data={data}
      meterId={meterId}
      fromEvent={(ev) => ev.target.checked}
    >
      {({ updateValue, data: value }) => {
        return (
          <div
            className={classes.checkbox}
            style={{ backgroundColor: color, ...style }}
          >
            <NoPaddingCheckbox
              icon={<span />}
              checkedIcon={<CheckCircle />}
              checked={value === "true" || !!value}
              onChange={(ev) => updateValue(ev)}
            />
          </div>
        );
      }}
    </ConnectedComponent>
  );
};

BooleanCell.propTypes = {
  meterId: PropTypes.string,
  classes: PropTypes.object,
  color: PropTypes.string,
  isLoading: PropTypes.bool,
  date: PropTypes.string,
  data: PropTypes.string,
  style: PropTypes.string,
};

export default withStyles(styles)(BooleanCell);
