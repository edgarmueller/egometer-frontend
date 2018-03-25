import * as React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import PropTypes from "prop-types";
import withHover from "./withHover";
import BooleanCell from "./BooleanCell";
import NumberCell from "./NumberCell";
import StringCell from "./StringCell";

export class GenericCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      inputValue: undefined
    };
  }

  render() {
    const { schema } = this.props;

    if (schema === undefined) {
      return null;
    }

    switch (schema.type) {
      case "boolean":
        return <BooleanCell {...this.props} />;
      case "number":
      case "integer":
        return <NumberCell {...this.props} />;
      case "string":
      default:
        return <StringCell {...this.props} />;
    }
  }
}

GenericCell.propTypes = {
  data: PropTypes.any,
  date: PropTypes.string,
  isLoading: PropTypes.bool,
  meterId: PropTypes.string,
  schema: PropTypes.object,
  updateEntry: PropTypes.func.isRequired
};

GenericCell.defaultProps = {
  data: undefined, // might be undefined before/during fetch
  isLoading: false,
  schema: {} // might be undefined before/during fetch
};

const mapStateToProps = state => ({
  isLoading: state.entries.loadingStatus.isLoading
});

export default compose(
  connect(mapStateToProps),
  withHover
)(GenericCell);
