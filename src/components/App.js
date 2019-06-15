import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import "./App.css";
import NavBar from "./common/NavBar";
import {
  userIsAuthenticated,
  userIsAdminRedir,
  userIsNotAuthenticated
} from "../common/auth";
import Loading from "./common/Loading";

const ConnectedSwitch = connect(state => ({
  location: state.router.location
}))(Switch);

const mainStyle = {
  margin: "auto"
};

const navStyle = {
  maxWidth: "1200px",
  margin: "auto"
};
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

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar className={navStyle} />
        <main style={mainStyle}>
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
              component={userIsAuthenticated(userIsAdminRedir(AsyncSchemaList))}
            />
            <Route
              exact
              path="/meters"
              component={userIsAuthenticated(AsyncMeterList)}
            />
            <Route
              exact
              path="/matrix/:year(\d{4})?/:month(0?[1-9]|1[012])?"
              component={userIsAuthenticated(AsycnMonthlyDashboard)}
            />
            <Route
              exact
              path="/weekly/:year(\d{4})?/:week(0?[1-9]|[0-9]{2})?"
              component={userIsAuthenticated(AsycnWeeklyDashboard)}
            />
            <Route
              exact
              path="/dashboard/:year(\d{4})?/:month(0?[1-9]|1[012])?/:day(0?[1-9]|1[0-9]|2[0-9]|3[01])?"
              component={userIsAuthenticated(AsyncDailyDashboard)}
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
            <Route
              path="*"
              component={userIsAuthenticated(AsyncDailyDashboard)}
            />
          </ConnectedSwitch>
        </main>
      </div>
    );
  }
}

export default App;
