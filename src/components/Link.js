import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Radium from "radium";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";

export const RadiumLink = Radium(RouterLink);

const Link = ({ to, label, classes }) => (
  <RadiumLink className={classes.link} to={to}>
    {label}
  </RadiumLink>
);

Link.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  currentRoute: PropTypes.string,
};

export default withStyles({
  link: {
    color: "#000",
  },
})(Link);
