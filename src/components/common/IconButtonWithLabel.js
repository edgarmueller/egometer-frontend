import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core";

const styles = {
  button: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    flexWrap: "wrap"
  },
  label: {
    fontSize: 10
  }
};

class IconButtonWithLabel extends React.Component {
  render() {
    const { classes, label, icon, onSubmit } = this.props;
    return (
      <span key={label} className={classes.button}>
        <IconButton aria-label={label} onClick={onSubmit}>
          {icon}
        </IconButton>
        <span className={classes.label}>{label}</span>
      </span>
    );
  }
}

IconButtonWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  onSubmit: PropTypes.func
};

IconButtonWithLabel.defaultProps = {
  onSubmit: () => {}
};

export default withStyles(styles)(IconButtonWithLabel);
