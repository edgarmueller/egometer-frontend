import Axios from "axios";
import { Auth0Client } from "@auth0/auth0-spa-js";
import { API_BASE_URL } from "../constants";

const contentType = "Content-Type";
const applicationJson = "application/json";

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

let auth0;
if (!navigator.userAgent.includes("jsdom")) {
  auth0 = new Auth0Client({
    domain: "edmue.eu.auth0.com",
    client_id: process.env.REACT_APP_AUTH0_CLIENTID,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    redirectUri: window.location.origin,
    onRedirectCallback,
    useRefreshTokens: true,
    cacheLocation: "localstorage",
  });
} else {
  auth0 = {
    getTokenSilently() {
      return undefined;
    },
  };
}

const createHeaders = (headers) => (token) => ({
  headers: {
    // eslint-disable-next-line no-undef
    Authorization: `Bearer ${token}`,
    ...headers,
  },
});

export const fetchMeters = async () => {
  const token = await auth0.getTokenSilently();
  return Axios.get(`${API_BASE_URL}/meters`, createHeaders()(token));
};

export const fetchSchemas = async () => {
  const token = await auth0.getTokenSilently();
  return Axios.get(
    `${API_BASE_URL}/schemas`,
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const fetchEntries = async (year, month) => {
  const token = await auth0.getTokenSilently();
  return Axios.get(
    `${API_BASE_URL}/entries?year=${year}&month=${month}`,
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const fetchEntriesByWeek = async (year, week) => {
  const token = await auth0.getTokenSilently();
  return Axios.get(
    `${API_BASE_URL}/entries?year=${year}&week=${week}`,
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const createMeter = async (schemaId, name, widget, color) => {
  const token = await auth0.getTokenSilently();
  return Axios.post(
    `${API_BASE_URL}/meters`,
    {
      schemaId,
      name,
      widget,
      color,
    },
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

// TODO
export const deleteMeter = async (meterId) => {
  const token = await auth0.getTokenSilently();
  return Axios.delete(
    `${API_BASE_URL}/meters/${meterId}`,
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const updateMeter = async (meter) => {
  const token = await auth0.getTokenSilently();
  return Axios.patch(
    `${API_BASE_URL}/meters/${meter.id}`,
    {
      ...meter,
      widget: meter.widget,
    },
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

// TODO
export const deleteSchema = async (schema) => {
  const token = await auth0.getTokenSilently();
  return Axios.delete(
    `${API_BASE_URL}/schemas/${schema.id}`,
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const updateEntry = async ({ meterId, date, value }) => {
  const token = await auth0.getTokenSilently();
  return Axios.put(
    `${API_BASE_URL}/entries/${date}/${meterId}`,
    { value },
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const deleteEntry = async (entry) => {
  const token = await auth0.getTokenSilently();
  return Axios.delete(
    `${API_BASE_URL}/entries/${entry.id}`,
    createHeaders()(token)
  );
};

// TODO: this should overwrite the value on the server
export const submitSchema = async (name, schema) => {
  const token = await auth0.getTokenSilently();
  return Axios.post(
    `${API_BASE_URL}/schemas`,
    {
      name,
      schema,
    },
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const loginUser = (email, password) =>
  Axios.post(
    `${API_BASE_URL}/auth/login`,
    { email, password },
    createHeaders()
  );

// TODO
export const logout = () =>
  Axios.post(`${API_BASE_URL}/sign-out`, undefined, createHeaders()).then(() =>
    // eslint-disable-next-line no-undef
    localStorage.removeItem("egometer.token")
  );

export const signUpWithEmail = async (name, email, password) => {
  return Axios.post(
    `${API_BASE_URL}/auth/signup`,
    { name, email, password },
    createHeaders({
      [contentType]: applicationJson,
    })
  );
};

// TODO
export const recoverPassword = (email) =>
  Axios.post(
    `${API_BASE_URL}/auth/forgot-password`,
    { email },
    {
      [contentType]: applicationJson,
    }
  );

// TODO
export const resetPassword = (currentPassword, newPassword, token) => {
  return Axios.post(
    `${API_BASE_URL}/auth/reset-password`,
    { currentPassword, newPassword, newPasswordToken: token },
    {
      [contentType]: applicationJson,
    }
  );
};

export const resetPasswordWithEmail = async (
  currentPassword,
  newPassword,
  email
) => {
  const resp = await Axios.post(
    `${API_BASE_URL}/auth/reset-password`,
    { currentPassword, newPassword, email },
    {
      [contentType]: applicationJson,
    }
  );
  return resp.status === 200;
};

export const resendVerificationMail = (email) => {
  return Axios.get(`${API_BASE_URL}/auth/resend-verification/${email}`);
};

// TODO
export const validateToken = (token) =>
  Axios.get(`${API_BASE_URL}/auth/forgot-password/verify/${token}`);

export const activateAccount = (token) => {
  const resp = Axios.get(`${API_BASE_URL}/auth/email/verify/${token}`);
  return resp;
};
