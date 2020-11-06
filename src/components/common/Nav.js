import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import BallotIcon from "@material-ui/icons/Ballot";
import TodayIcon from "@material-ui/icons/Today";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ExtensionIcon from "@material-ui/icons/Extension";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose, withProps } from "recompose";
import { Link } from "react-router-dom";
import Radium from "radium";
import { Hidden } from "@material-ui/core";
import Ionicon from "react-ionicons";
import get from "lodash/get";
import LinkButton from "../LinkButton";

import widgets from "../../widgets";
import { getSchemas } from "../../reducers";
import { logo } from "../../common/styles";
import { withStyles } from "@material-ui/styles";

export const RadiumLink = Radium(Link);

export const Nav = ({ classes, logout, location, history, isAdmin }) => {
  const [currentRoute, setRoute] = useState(location.pathname);
  useEffect(() =>
    history.listen((location) => {
      setRoute(location.pathname);
    })
  );

  return (
    <List>
      <ListItem alignItems="center">
        <RadiumLink className={classes.logo} to="/">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicon icon="md-flash" />
            egometer
          </div>
        </RadiumLink>
      </ListItem>
      <Divider />
      {isAdmin ? (
        <ListItem>
          <ListItemIcon>
            <ExtensionIcon />
          </ListItemIcon>
          <LinkButton
            to="/schemas"
            label="Schemas"
            currentRoute={currentRoute}
          />
        </ListItem>
      ) : null}
      <Hidden xsDown>
        <ListItem>
          <ListItemIcon>
            <CalendarViewDayIcon />
          </ListItemIcon>
          <LinkButton to="/matrix" label="Month" currentRoute={currentRoute} />
        </ListItem>
      </Hidden>
      <Hidden xsDown>
        <ListItem>
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <LinkButton to="/weekly" label="Week" currentRoute={currentRoute} />
        </ListItem>
      </Hidden>
      <ListItem>
        <ListItemIcon>
          <TodayIcon />
        </ListItemIcon>
        <LinkButton to="/dashboard" label="Today" currentRoute={currentRoute} />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <BallotIcon />
        </ListItemIcon>
        <LinkButton to="/meters" label="Meters" currentRoute={currentRoute} />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <BallotIcon />
        </ListItemIcon>
        <LinkButton to="/profile" label="Profile" currentRoute={currentRoute} />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <Button onClick={logout}>Logout</Button>
      </ListItem>
    </List>
  );
};

Nav.propTypes = {
  classes: PropTypes.shape({
    logo: PropTypes.string.isRequired,
  }).isRequired,
  logout: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  location: PropTypes.any,
  history: PropTypes.any,
};

Nav.defaultProps = {};

const mapStateToProps = (state) => ({
  schemas: getSchemas(state),
  isAdmin: get(state, "user.isAdmin", false),
});

const styles = {
  logo,
};

export default compose(
  withProps({ widgets }),
  connect(mapStateToProps, null)
)(withStyles(styles)(Nav));
