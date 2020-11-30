import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";
import WithLayout from "./common/WithLayout";
import Loading from "./common/Loading";
import PeriodicAuthCheck from "../components/auth/PeriodicAuthCheck";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { fetchSchemas, fetchMeters } from "../actions";

const ConnectedSwitch = connect((state) => ({
  location: state.router.location,
}))(Switch);

const AsyncLoginPage = Loadable({
  loader: () => import("./auth/LoginPage"),
  loading: Loading,
});
const AsyncDailyDashboard = Loadable({
  loader: () => import("./daily/DailyDashboard"),
  loading: Loading,
});
const AsyncMeterList = Loadable({
  loader: () => import("./meters/MeterList"),
  loading: Loading,
});
const AsycnMonthlyDashboard = Loadable({
  loader: () => import("./monthly/MonthlyDashboard"),
  loading: Loading,
});
const AsycnWeeklyDashboard = Loadable({
  loader: () => import("./weekly/WeeklyDashboard"),
  loading: Loading,
});

export const App = ({ fetchSchemas, fetchMeters }) => {
  const { isAuthenticated } = useAuth0;
  useEffect(() => {
    fetchSchemas();
    fetchMeters();
  }, []);

  return (
    <div className="App" id="app">
      <CssBaseline />
      <ConnectedSwitch>
        <Route
          exact
          path="/login"
          component={isAuthenticated ? AsycnWeeklyDashboard : AsyncLoginPage}
        />
        <Route
          exact
          path="/meters"
          component={withAuthenticationRequired(WithLayout(AsyncMeterList))}
        />
        <Route
          exact
          path="/matrix/:year(\d{4})?/:month(0?[1-9]|1[012])?"
          component={withAuthenticationRequired(
            WithLayout(AsycnMonthlyDashboard)
          )}
        />
        <Route
          exact
          path="/weekly/:year(\d{4})?/:week(0?[1-9]|[0-9]{2})?"
          component={withAuthenticationRequired(
            WithLayout(AsycnWeeklyDashboard)
          )}
        />
        <Route
          exact
          path="/dashboard/:year(\d{4})?/:month(0?[1-9]|1[012])?/:day(0?[1-9]|1[0-9]|2[0-9]|3[01])?"
          component={WithLayout(
            withAuthenticationRequired(AsyncDailyDashboard)
          )}
        />
        <Route
          path="*"
          component={
            isAuthenticated
              ? withAuthenticationRequired(WithLayout(AsyncDailyDashboard))
              : AsyncLoginPage
          }
        />
      </ConnectedSwitch>
      <PeriodicAuthCheck loginPath="/login" />
    </div>
  );
};

App.propTypes = {
  fetchSchemas: PropTypes.func.isRequired,
  fetchMeters: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  fetchSchemas: () => {
    dispatch(fetchSchemas());
  },
  fetchMeters: () => {
    dispatch(fetchMeters());
  },
});

export default connect(undefined, mapDispatchToProps)(App);
