import * as React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import PropTypes from "prop-types";
import withHover from "./withHover";
import BooleanCell from "./BooleanCell";
import NumberCell from "./NumberCell";
import StringCell from "./StringCell";

export const GenericCell = ({ schema, ...props }) => {
  if (schema === undefined) {
    return null;
  }

  switch (schema.type) {
    case "boolean":
      return <BooleanCell {...props} />;
    case "number":
    case "integer":
      return <NumberCell {...props} />;
    case "string":
    default:
      return <StringCell {...props} />;
  }
};

GenericCell.propTypes = {
  data: PropTypes.any,
  date: PropTypes.string,
  isLoading: PropTypes.bool,
  meterId: PropTypes.string,
  schema: PropTypes.object
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
