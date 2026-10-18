import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";
import WithLayout from "./common/WithLayout";
import Loading from "./common/Loading";
import { useAuth } from "./auth/AuthProvider";
import requireAuth from "./auth/requireAuth";
import { fetchMeters } from "../actions";

const ConnectedSwitch = connect((state) => ({
  location: state.router.location,
}))(Switch);

// react-loadable only unwraps the default export of webpack modules
const loadPage = (load) =>
  Loadable({
    loader: () => load().then((module) => module.default),
    loading: Loading,
  });

const AsyncLoginPage = loadPage(() => import("./auth/LoginPage"));
const AsyncDailyDashboard = loadPage(() => import("./daily/DailyDashboard"));
const AsyncMeterList = loadPage(() => import("./meters/MeterList"));
const AsycnMonthlyDashboard = loadPage(() =>
  import("./monthly/MonthlyDashboard")
);
const AsycnWeeklyDashboard = loadPage(() => import("./weekly/WeeklyDashboard"));

const MeterListPage = requireAuth(WithLayout(AsyncMeterList));
const MonthlyDashboardPage = requireAuth(WithLayout(AsycnMonthlyDashboard));
const WeeklyDashboardPage = requireAuth(WithLayout(AsycnWeeklyDashboard));
const DailyDashboardPage = requireAuth(WithLayout(AsyncDailyDashboard));

export const App = ({ fetchMeters }) => {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      fetchMeters();
    }
  }, [isAuthenticated, fetchMeters]);

  return (
    <div className="App" id="app">
      <CssBaseline />
      <ConnectedSwitch>
        <Route exact path="/login" component={AsyncLoginPage} />
        <Route exact path="/meters" component={MeterListPage} />
        <Route
          exact
          path="/matrix/:year(\d{4})?/:month(0?[1-9]|1[012])?"
          component={MonthlyDashboardPage}
        />
        <Route
          exact
          path="/weekly/:year(\d{4})?/:week(0?[1-9]|[0-9]{2})?"
          component={WeeklyDashboardPage}
        />
        <Route
          exact
          path="/dashboard/:year(\d{4})?/:month(0?[1-9]|1[012])?/:day(0?[1-9]|1[0-9]|2[0-9]|3[01])?"
          component={DailyDashboardPage}
        />
        <Route path="*" component={DailyDashboardPage} />
      </ConnectedSwitch>
    </div>
  );
};

App.propTypes = {
  fetchMeters: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  fetchMeters: () => {
    dispatch(fetchMeters());
  },
});

export default connect(undefined, mapDispatchToProps)(App);
