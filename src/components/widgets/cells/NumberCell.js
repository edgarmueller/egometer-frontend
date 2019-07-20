import React, { useContext } from "react";
import { compose } from "redux";
import * as _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import ConnectedComponent from "../../../components/common/ConnectedComponent";
import { MeterContext } from "../../../context";

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
    this.props.handleOnKeyDown(ev);
    ev.key === "Enter" && this.ref.current.blur();
  };

  handleOnChange = ev => {
    this.props.handleOnChange(ev);
  };

  handleOnBlur = ev => {
    this.props.handleOnBlur(ev);
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
  const { deleteEntry, updateEntry } = useContext(MeterContext);
  return (
    <ConnectedComponent
      data={data}
      date={date}
      meterId={meterId}
      updateEntry={updateEntry(meterId, date)}
      deleteEntry={deleteEntry}
      updateOnChange={false}
      isLoading={isLoading}
      fromEvent={ev => _.toNumber(ev.target.value)}
      shouldDebounce
    >
      {props => <StyledNumberInput {...props} color={color} style={style} />}
    </ConnectedComponent>
  );
};

export default NumberCell;
