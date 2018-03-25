import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";

const IconButtonWithLabel = ({ label, icon, onSubmit }) => (
  <span
    key={label}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
      flexWrap: "wrap"
    }}
  >
    <IconButton aria-label={label} onClick={onSubmit}>
      {icon}
    </IconButton>
    <span style={{ fontSize: 10 }}>{label}</span>
  </span>
);

IconButtonWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  onSubmit: PropTypes.func
};

IconButtonWithLabel.defaultProps = {
  onSubmit: () => {}
};

export default IconButtonWithLabel;
