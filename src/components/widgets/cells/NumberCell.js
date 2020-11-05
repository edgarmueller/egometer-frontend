import React from "react";
import { compose } from "redux";
import * as _ from "lodash";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ConnectedComponent from "../../../components/common/ConnectedComponent";

const styles = {
  numberCell: {
    width: "100%",
    height: "100%",
    fontSize: "0.75rem",
    maxWidth: 30,
    maxHeight: 30,
    borderRadius: 5,
    display: "flex",
    textAlign: "center",
    border: "none",
    "&:hover": {
      backgroundColor: "rgb(65, 102, 170, 0.5)",
      color: "#fff",
    },
  },
};

class NumberInput extends React.PureComponent {
  ref = React.createRef();

  handleOnKeyDown = (ev) => {
    this.props.updateValue(ev);
    ev.key === "Enter" && this.ref.current.blur();
  };

  handleOnChange = (ev) => {
    this.props.updateValue(ev);
  };

  handleOnBlur = (ev) => {
    this.props.submitEntry(ev);
  };

  render() {
    const { classes, data, color, style } = this.props;
    return (
      <input
        ref={this.ref}
        className={classes.numberCell}
        style={{ backgroundColor: color, ...style }}
        type={"number"}
        value={data || ""}
        onChange={this.handleOnChange}
        onKeyDown={this.handleOnKeyDown}
        onBlur={this.handleOnBlur}
        step={0.01}
      />
    );
  }
}

NumberInput.propTypes = {
  updateValue: PropTypes.func,
  submitEntry: PropTypes.func,
  classes: PropTypes.object,
  data: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.string,
};

const StyledNumberInput = compose(withStyles(styles))(NumberInput);

const NumberCell = ({ color, date, data, meterId, isLoading, style }) => {
  return (
    <ConnectedComponent
      data={data}
      date={date}
      meterId={meterId}
      updateOnChange={false}
      isLoading={isLoading}
      fromEvent={(ev) => _.toNumber(ev.target.value)}
      shouldDebounce
    >
      {(props) => <StyledNumberInput {...props} color={color} style={style} />}
    </ConnectedComponent>
  );
};

NumberCell.propTypes = {
  color: PropTypes.string,
  date: PropTypes.string,
  data: PropTypes.string,
  meterId: PropTypes.string,
  isLoading: PropTypes.bool,
  style: PropTypes.object,
};

export default React.memo(NumberCell);
