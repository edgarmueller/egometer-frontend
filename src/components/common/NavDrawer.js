import React, { Fragment } from "react";
import Drawer from "@material-ui/core/Drawer";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { routerActions } from "react-router-redux";

import { logout } from "../../actions";
import Nav from "./Nav";
import { Hidden } from "@material-ui/core";

const drawerWidth = 180;

const styles = () => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  }
});

export const NavDrawer = ({
  classes,
  isAuthenticated,
  history,
  location,
  logout,
  isNavOpen,
  closeNav
}) => {
  if (isAuthenticated) {
    return (
      <Fragment>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            onClose={closeNav}
            className={classes.drawer}
          >
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
  navigateTo: PropTypes.func.isRequired
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
