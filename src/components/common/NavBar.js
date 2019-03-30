import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Ionicon from "react-ionicons";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { routerActions } from "react-router-redux";
import Radium from "radium";
import { link, logo } from "../../common/styles";
import { logout } from "../../actions";
import { visibleOnlyAdmin } from "../../common/auth";
import AddMeter from "./AddMeter";
import widgets from "../../widgets";
import { fetchMeters } from "../../actions";

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

export const RadiumLink = Radium(Link);
export const LinkButton = ({ className, link, label, currentRoute }) => (
  <Button
    className={className}
    component={RadiumLink}
    to={link}
    style={{
      backgroundColor: currentRoute === link ? "rgb(65, 102, 170, 0.5)" : null,
      color: currentRoute === link ? "#fff" : null
    }}
  >
    {label}
  </Button>
);
const AdminLinkButton = visibleOnlyAdmin(props => <LinkButton {...props} />);
const isDevmode = process.env.NODE_ENV === "development";

export const NavBar = ({
  classes,
  isAuthenticated,
  logout,
  fetchMeters,
  location,
  history
}) => {
  const [open, setOpen] = useState(false);
  const [currentRoute, setRoute] = useState(location.pathname);
  const handleClick = useCallback(() => setOpen(true));
  const handleClose = useCallback(() => setOpen(false));
  useEffect(() =>
    history.listen((location, action) => {
      setRoute(location.pathname);
    })
  );
  const confirmDialog = () => {
    handleClose();
    fetchMeters();
  };

  if (isAuthenticated) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "0.5rem" }}
      >
        <nav>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#fff",
              color: "#fff",
              borderRadius: 30,
              border: '1px solid rgb(65, 102, 170, 0.5)'
            }}
          >
            <AdminLinkButton
              link="/schemas"
              label="Schemas"
              className={classes.link}
              currentRoute={currentRoute}
            />
            <LinkButton
              link="/matrix"
              label="Month"
              className={classes.link}
              currentRoute={currentRoute}
            />
            <LinkButton
              link="/weekly"
              label="Week"
              className={classes.link}
              currentRoute={currentRoute}
            />
            <LinkButton
              link="/dashboard"
              label="Today"
              className={classes.link}
              currentRoute={currentRoute}
            />
            <LinkButton
              link="/meters"
              label="Meters"
              className={classes.link}
              currentRoute={currentRoute}
            />
            <Button className={classes.link} onClick={logout}>
              Logout
            </Button>
          </div>
        </nav>
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
        <Button
          variant="outlined"
          size="small"
          color="primary"
          aria-label="Add"
          style={{
            color: "rgb(65, 102, 170)",
            borderRadius: 30
          }}
          onClick={handleClick}
        >
          <AddIcon />
          Add meter
        </Button>
        <Drawer open={open} onClose={handleClose}>
          <AddMeter
            open={open}
            onSubmit={confirmDialog}
            handleClose={handleClose}
            widgets={widgets}
          />
        </Drawer>
      </div>
    );
  }

  return (
    <nav>
      <AppBar className={classes.appBar} position={"static"}>
        <Toolbar>
          <RadiumLink className={classes.logo} to="/">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Ionicon icon="md-flash" />
              egometer
            </div>
          </RadiumLink>
        </Toolbar>
      </AppBar>
    </nav>
  );
};

NavBar.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    link: PropTypes.string.isRequired
  }).isRequired
};

NavBar.defaultProps = {
  user: undefined
};

const mapDispatchToProps = dispatch => ({
  navigateTo(destination) {
    dispatch(routerActions.push(destination));
  },
  logout() {
    dispatch(logout());
  },
  fetchMeters() {
    dispatch(fetchMeters());
  }
});

export default connect(
  s => ({
    isAuthenticated: s.user.isAuthenticated
  }),
  mapDispatchToProps
)(withStyles(styles)(withRouter(NavBar)));
