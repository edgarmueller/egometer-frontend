import React, { Fragment, useState, useCallback } from "react";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { routerActions } from "react-router-redux";
import Ionicon from "react-ionicons";
import { IconButton, Hidden } from "@material-ui/core";

import Radium from "radium";
import { link, logo } from "../../common/styles";
import { logout } from "../../actions";
import Nav from "./Nav";
import { fetchMeters } from "../../actions";

export const RadiumLink = Radium(Link);

const styles = () => ({
  appBar: {
    backgroundColor: "#fff",
    boxShadow: "none",
    borderBottom: "1px solid #ebebeb",
    flexDirection: "row",
    justifyContent: "center"
  },
  link: {
    ...link,
    borderRadius: 30,
    color: "rgb(65, 102, 170)"
  },
  logo
});

const isDevmode = process.env.NODE_ENV === "development";

export const NavDrawer = ({
  classes,
  isAuthenticated,
  history,
  location,
  logout
}) => {
  const [isNavOpen, setNavOpen] = useState(false);
  const openNav = useCallback(() => setNavOpen(true), [setNavOpen]);
  const closeNav = useCallback(() => setNavOpen(false), [setNavOpen]);

  if (isAuthenticated) {
    return (
      <Fragment>
        <Hidden mdUp>
          <IconButton onClick={openNav}>
            <MenuIcon />
          </IconButton>
        </Hidden>
        <RadiumLink
          className={classes.logo}
          to="/"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Ionicon icon="md-flash" />
          egometer
          {isDevmode && (
            <strong style={{ color: "#FF7043" }}>&nbsp;DEVMODE</strong>
          )}
        </RadiumLink>
        <Hidden mdDown implementation="css">
          <Drawer variant="permanent" onClose={closeNav}>
            <Nav logout={logout} location={location} history={history} />
          </Drawer>
        </Hidden>
        <Drawer open={isNavOpen} onClose={closeNav} onClick={closeNav}>
          <Nav logout={logout} location={location} history={history} />
        </Drawer>
      </Fragment>
    );
  }

  return null;
};

NavDrawer.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    link: PropTypes.string.isRequired
  }).isRequired
};

NavDrawer.defaultProps = {
  user: undefined
};

const mapDispatchToProps = dispatch => ({
  navigateTo(destination) {
    dispatch(routerActions.push(destination));
  },
  logout() {
    dispatch(logout());
  }
});

export default connect(
  s => ({
    isAuthenticated: s.user.isAuthenticated
  }),
  mapDispatchToProps
)(withStyles(styles)(withRouter(NavDrawer)));
