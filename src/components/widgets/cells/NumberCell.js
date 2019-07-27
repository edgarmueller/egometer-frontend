import React from "react";
import { compose } from "redux";
import * as _ from "lodash";
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
      color: "#fff"
    }
  }
};

class NumberInput extends React.PureComponent {
  ref = React.createRef();

  handleOnKeyDown = ev => {
    this.props.updateValue(ev);
    ev.key === "Enter" && this.ref.current.blur();
  };

  handleOnChange = ev => {
    this.props.updateValue(ev);
  };

  handleOnBlur = ev => {
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

const StyledNumberInput = compose(withStyles(styles))(NumberInput);

const NumberCell = ({ color, date, data, meterId, isLoading, style }) => {
  return (
    <ConnectedComponent
      data={data}
      date={date}
      meterId={meterId}
      updateOnChange={false}
      isLoading={isLoading}
      fromEvent={ev => _.toNumber(ev.target.value)}
      shouldDebounce
    >
      {props => <StyledNumberInput {...props} color={color} style={style} />}
    </ConnectedComponent>
  );
};

export default React.memo(NumberCell);
