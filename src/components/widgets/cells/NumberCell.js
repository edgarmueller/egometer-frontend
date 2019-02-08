import * as React from "react";
import { compose } from "redux";
import * as _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import ConnectedComponent from "../../../components/common/ConnectedComponent";

const styles = {
  numberCell: {
    width: "100%",
    height: "100%",
    display: "flex",
    textAlign: "center",
    fontWeight: 700,
    border: "none"
  }
};

class NumberInput extends React.Component {
  ref = React.createRef();

  constructor(props) {
    super(props);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }

  handleOnKeyDown(ev) {
    this.props.handleOnKeyDown(ev);
    ev.key === "Enter" && this.ref.current.blur();
  }

  handleOnBlur() {
    this.props.submitEntry();
  }

  render() {
    const { classes, data, handleOnChange, color } = this.props;
    return (
      <input
        ref={this.ref}
        className={classes.numberCell}
        style={{ backgroundColor: color }}
        type={"number"}
        value={data || ""}
        onChange={handleOnChange}
        onKeyDown={this.handleOnKeyDown}
        onBlur={this.handleOnBlur}
      />
    );
  }
}

const StyledNumberInput = compose(withStyles(styles))(NumberInput);

class NumberCell extends React.Component {
  render() {
    const { color, date, data, meterId, updateEntry, isLoading } = this.props;
    return (
      <ConnectedComponent
        data={data}
        date={date}
        meterId={meterId}
        updateEntry={updateEntry}
        updateOnChange={false}
        isLoading={isLoading}
        fromEvent={ev => _.toNumber(ev.target.value)}
      >
        {props => <StyledNumberInput {...props} color={color} />}
      </ConnectedComponent>
    );
  }
}

export default NumberCell;
