import React, { Fragment } from "react";
import Drawer from "@material-ui/core/Drawer";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { routerActions } from "react-router-redux";

import Nav from "./Nav";
import { Hidden } from "@material-ui/core";
import { useAuth0 } from "@auth0/auth0-react";

const drawerWidth = 180;

const styles = () => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
});

export const NavDrawer = ({
  classes,
  history,
  location,
  isNavOpen,
  closeNav,
}) => {
  const { isAuthenticated } = useAuth0();
  if (isAuthenticated) {
    return (
      <Fragment>
        <Hidden mdDown implementation="css">
          <Drawer
            variant="permanent"
            onClose={closeNav}
            className={classes.drawer}
          >
            <Nav location={location} history={history} />
          </Drawer>
        </Hidden>
        <Drawer open={isNavOpen} onClose={closeNav} onClick={closeNav}>
          <Nav location={location} history={history} />
        </Drawer>
      </Fragment>
    );
  }

  return null;
};

NavDrawer.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  classes: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  history: PropTypes.object,
  location: PropTypes.object,
  isNavOpen: PropTypes.bool,
  closeNav: PropTypes.func,
};

NavDrawer.defaultProps = {
  user: undefined,
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo(destination) {
    dispatch(routerActions.push(destination));
  },
});

export default connect(
  (state) => ({ isAuthenticated: state.user.isAuthenticated }),
  mapDispatchToProps
)(withStyles(styles)(withRouter(NavDrawer)));
