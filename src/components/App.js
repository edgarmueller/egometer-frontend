import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import Radium from "radium";
import "./App.css";
import WithLayout from "./common/WithLayout";
import {
  userIsAuthenticated,
  userIsAdminRedir,
  userIsNotAuthenticated
} from "../common/auth";
import Loading from "./common/Loading";
import { logo } from "../common/styles";

export const RadiumLink = Radium(Link);

const ConnectedSwitch = connect(state => ({
  location: state.router.location
}))(Switch);

const AsyncLoginPage = Loadable({
  loader: () => import("./auth/LoginPage"),
  loading: Loading
});
const AsyncSignUpPage = Loadable({
  loader: () => import("./auth/SignUpPage"),
  loading: Loading
});
const AsyncActivedAccountPage = Loadable({
  loader: () => import("./auth/ActivatedAccountPage"),
  loading: Loading
});
const AsyncRecoverPasswordPage = Loadable({
  loader: () => import("./auth/RecoverPasswordPage"),
  loading: Loading
});
const AsyncResetPasswordPage = Loadable({
  loader: () => import("./auth/ResetPasswordPage"),
  loading: Loading
});
const AsyncDailyDashboard = Loadable({
  loader: () => import("../components/daily/DailyDashboard"),
  loading: Loading
});
const AsyncSchemaList = Loadable({
  loader: () => import("../components/schemas/SchemaList"),
  loading: Loading
});
const AsyncMeterList = Loadable({
  loader: () => import("../components/meters/MeterList"),
  loading: Loading
});
const AsycnMonthlyDashboard = Loadable({
  loader: () => import("../components/monthly/MonthlyDashboard"),
  loading: Loading
});
const AsycnWeeklyDashboard = Loadable({
  loader: () => import("../components/weekly/WeeklyDashboard"),
  loading: Loading
});

export const App = ({ classes }) => {
  return (
    <div className="App" id="app">
      <CssBaseline />
      <ConnectedSwitch>
        <Route
          exact
          path="/login"
          component={userIsNotAuthenticated(AsyncLoginPage)}
        />
        <Route
          exact
          path="/sign-up"
          component={userIsNotAuthenticated(AsyncSignUpPage)}
        />
        <Route
          exact
          path="/schemas"
          component={userIsAuthenticated(
            userIsAdminRedir(WithLayout(AsyncSchemaList))
          )}
        />
        <Route
          exact
          path="/meters"
          component={userIsAuthenticated(WithLayout(AsyncMeterList))}
        />
        <Route
          exact
          path="/matrix/:year(\d{4})?/:month(0?[1-9]|1[012])?"
          component={userIsAuthenticated(WithLayout(AsycnMonthlyDashboard))}
        />
        <Route
          exact
          path="/weekly/:year(\d{4})?/:week(0?[1-9]|[0-9]{2})?"
          component={userIsAuthenticated(WithLayout(AsycnWeeklyDashboard))}
        />
        <Route
          exact
          path="/dashboard/:year(\d{4})?/:month(0?[1-9]|1[012])?/:day(0?[1-9]|1[0-9]|2[0-9]|3[01])?"
          component={userIsAuthenticated(WithLayout(AsyncDailyDashboard))}
        />
        <Route
          path="*"
          component={userIsAuthenticated(WithLayout(AsyncDailyDashboard))}
        />
        <Route
          exact
          path="/auth/account/activation/:token"
          component={AsyncActivedAccountPage}
        />
        <Route
          exact
          path="/auth/recover/password"
          component={AsyncRecoverPasswordPage}
        />
        <Route
          exact
          path="/auth/recover/password/:token"
          component={AsyncResetPasswordPage}
        />
      </ConnectedSwitch>
    </div>
  );
};

App.propTypes = {
  classes: PropTypes.shape({
    logo: PropTypes.string.isRequired
  }).isRequired
};

const styles = {
  logo
};

export default withStyles(styles)(App);
