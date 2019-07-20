import React from "react";
import PropTypes from "prop-types";

// TODO make a context/hook out of this context?
export class ConnectedComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: props.data
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      (this.props.date && prevProps.date !== this.props.date) ||
      (prevProps.isLoading && !this.props.isLoading) ||
      prevProps.data !== this.props.data
    ) {
      // only update data via props if either the date or the loading state changes
      this.setState({
        text: this.props.data
      });
    }
  }

  handleOnChange = ev => {
    const {
      updateOnChange,
      updateEntry,
      fromEvent,
      shouldDebounce
    } = this.props;
    const newValue = fromEvent(ev);
    this.setState({ text: newValue });
    if (updateOnChange) {
      updateEntry(newValue, shouldDebounce);
    }
  };

  handleOnBlur() {
    this.submitEntry();
  }

  handleOnKeyDown = ev => {
    const { fromEvent } = this.props;
    const newValue = fromEvent(ev);
    this.setState({ text: newValue });
  };

  submitEntry = () => {
    const { updateEntry, shouldDebounce } = this.props;
    updateEntry(this.state.text, shouldDebounce);
  };

  reset = () => {
    this.setState({ text: this.props.data });
  };

  render() {
    const { children } = this.props;

    return (
      <React.Fragment>
        {children({
          handleOnChange: this.handleOnChange,
          handleOnKeyDown: this.handleOnKeyDown,
          handleOnBlur: this.handleOnBlur,
          data: this.state.text,
          submitEntry: this.submitEntry,
          reset: this.reset
        })}
      </React.Fragment>
    );
  }
}

ConnectedComponent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  fromEvent: PropTypes.func,
  updateOnChange: PropTypes.bool,
  updateEntry: PropTypes.func.isRequired,
  deleteEntry: PropTypes.func.isRequired,
  // TODO: maybe rename prop to initData?
  data: PropTypes.any,
  date: PropTypes.string,
  shouldDebounce: PropTypes.bool
};

ConnectedComponent.defaultProps = {
  fromEvent: x => x.target.value,
  updateOnChange: true,
  data: "",
  shouldDebounce: false
};

export default ConnectedComponent;
