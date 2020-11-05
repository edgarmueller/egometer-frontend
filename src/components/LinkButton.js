import React from "react";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import Radium from "radium";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { button } from "../common/styles";

export const RadiumLink = Radium(Link);

const LinkButton = ({ to, label, currentRoute, classes }) => (
  <Button
    className={classes.button}
    component={RadiumLink}
    to={to}
    style={{
      backgroundColor: currentRoute === to ? "rgb(65, 102, 170, 0.5)" : null,
      color: currentRoute === to ? "#fff" : null,
    }}
  >
    {label}
  </Button>
);

LinkButton.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  currentRoute: PropTypes.string,
  classes: PropTypes.object,
};

export default withStyles({ button })(LinkButton);
