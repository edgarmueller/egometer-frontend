import Axios from "axios";
import { BASE_URL } from "../constants";

const contentType = "Content-Type";
const applicationJson = "application/json";

const createHeaders = headers => ({
  headers: {
    "X-Auth-Token": localStorage.getItem("egometer.token"),
    ...headers
  }
});

export const fetchMeters = () =>
  Axios.get(`${BASE_URL}/meters`, createHeaders());

export const fetchSchemas = () =>
  Axios.get(
    `${BASE_URL}/schemas`,
    createHeaders({
      [contentType]: applicationJson
    })
  );

export const fetchEntriesPerMonth = (date, meterId) =>
  Axios.get(
    meterId === undefined
      ? `${BASE_URL}/entries/${date}`
      : `${BASE_URL}/entries/${date}/${meterId}`,
    createHeaders({
      [contentType]: applicationJson
    })
  );

export const createMeter = (schemaId, name, widget, color) =>
  Axios.post(
    `${BASE_URL}/meters`,
    {
      schemaId,
      name,
      widget,
      color
    },
    createHeaders({
      [contentType]: applicationJson
    })
  );

export const deleteMeter = meterId =>
  Axios.delete(
    `${BASE_URL}/meters/${meterId}`,
    createHeaders({
      [contentType]: applicationJson
    })
  );

export const updateMeter = meter =>
  Axios.post(
    `${BASE_URL}/meters/${meter.id}`,
    {
      ...meter,
      visualization: meter.widget
    },
    createHeaders({
      [contentType]: applicationJson
    })
  );

export const deleteSchema = schema =>
  Axios.delete(
    `${BASE_URL}/schemas/${schema.id}`,
    createHeaders({
      [contentType]: applicationJson
    })
  );

export const updateEntry = ({ meterId, date, value }) => {
  return Axios.post(
    `${BASE_URL}/entries/${date}/${meterId}`,
    { value },
    createHeaders({
      [contentType]: applicationJson
    })
  );
};

// TODO: this should overwrite the value on the server
export const submitSchema = (name, schema) => {
  return Axios.post(
    `${BASE_URL}/schemas`,
    {
      name,
      schema
    },
    createHeaders({
      [contentType]: applicationJson
    })
  );
};

export const verifyToken = zi => {
  return Axios.post(
    `${BASE_URL}/verify/google`,
    zi,
    createHeaders({
      [contentType]: applicationJson
    })
  );
};

export const loginUser = (email, password, rememberMe) =>
  Axios.post(
    `${BASE_URL}/sign-in`,
    { email, password, rememberMe: true },
    createHeaders()
  );

export const logout = () => {
  return Axios.get(`${BASE_URL}/sign-out`, createHeaders()).then(() =>
    localStorage.removeItem("egometer.token")
  );
};

export const signUpWithEmail = (name, email, password) => {
  return Axios.post(
    `${BASE_URL}/sign-up`,
    { name, email, password },
    createHeaders({
      [contentType]: applicationJson
    })
  );
};

export const recoverPassword = email => {
  return Axios.post(
    `${BASE_URL}/password/recovery`,
    { email },
    {
      [contentType]: applicationJson
    }
  );
};

export const resetPassword = (token, password) => {
  return Axios.post(
    `${BASE_URL}/password/recovery/${token}`,
    { password },
    {
      [contentType]: applicationJson
    }
  );
};

export const validateToken = token =>
  Axios.get(`${BASE_URL}/password/recovery/${token}`);

export const activateAccount = token => {
  return Axios.get(`${BASE_URL}/account/activation/${token}`);
};

export const testToken = token =>
  Axios.get(`${BASE_URL}/is-signed-in`, { headers: { "X-Auth-Token": token } });
