import Axios from "axios";
import { BASE_URL } from "../constants";

const contentType = "Content-Type";
const applicationJson = "application/json";
const API_VERSION = "v1";
const API_BASE_URL = `${BASE_URL}/api/${API_VERSION}`;

const createHeaders = headers => ({
  headers: {
    "X-Auth-Token": localStorage.getItem("egometer.token"),
    ...headers
  }
});

export const fetchMeters = () =>
  Axios.get(`${API_BASE_URL}/meters`, createHeaders());

export const fetchSchemas = () =>
  Axios.get(
    `${API_BASE_URL}/schemas`,
    createHeaders({
      [contentType]: applicationJson
    })
  );

export const fetchEntriesByDate = (date, meterId, days) => {
  if (days) {
    return Axios.get(
      meterId === undefined
        ? `${API_BASE_URL}/entries/${date}?days=${days}`
        : `${API_BASE_URL}/entries/${date}/${meterId}?days=${days}`,
      createHeaders({
        [contentType]: applicationJson
      })
    );
  } else {
    return Axios.get(
      meterId === undefined
        ? `${API_BASE_URL}/entries/${date}`
        : `${API_BASE_URL}/entries/${date}`,
      createHeaders({
        [contentType]: applicationJson
      })
    );
  }
}

export const createMeter = (schemaId, name, widget, color) =>
  Axios.post(
    `${API_BASE_URL}/meters`,
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
    `${API_BASE_URL}/meters/${meterId}`,
    createHeaders({
      [contentType]: applicationJson
    })
  );

export const updateMeter = meter =>
  Axios.post(
    `${API_BASE_URL}/meters/${meter.id}`,
    {
      ...meter,
      widget: meter.widget
    },
    createHeaders({
      [contentType]: applicationJson
    })
  );

export const deleteSchema = schema =>
  Axios.delete(
    `${API_BASE_URL}/schemas/${schema.id}`,
    createHeaders({
      [contentType]: applicationJson
    })
  );

export const updateEntry = ({ meterId, date, value }) => {
  return Axios.post(
    `${API_BASE_URL}/entries/${date}/${meterId}`,
    { value },
    createHeaders({
      [contentType]: applicationJson
    })
  );
};

export const deleteEntry = entry => {
  console.log('entry', entry)
  return Axios.delete(
    `${API_BASE_URL}/entries/${entry.id}`,
    createHeaders()
  );
};

// TODO: this should overwrite the value on the server
export const submitSchema = (name, schema) =>
  Axios.post(
    `${API_BASE_URL}/schemas`,
    {
      name,
      schema
    },
    createHeaders({
      [contentType]: applicationJson
    })
  );

export const loginUser = (email, password, rememberMe) =>
  Axios.post(
    `${API_BASE_URL}/sign-in`,
    { email, password, rememberMe: true },
    createHeaders()
  );

export const logout = () =>
  Axios.post(`${API_BASE_URL}/sign-out`, undefined, createHeaders()).then(() =>
    localStorage.removeItem("egometer.token")
  );

export const signUpWithEmail = (name, email, password) => {
  return Axios.post(
    `${API_BASE_URL}/sign-up`,
    { name, email, password },
    createHeaders({
      [contentType]: applicationJson
    })
  );
};

export const recoverPassword = email =>
  Axios.post(
    `${API_BASE_URL}/password/recovery`,
    { email },
    {
      [contentType]: applicationJson
    }
  );

export const resetPassword = (token, password) => {
  return Axios.post(
    `${API_BASE_URL}/password/recovery/${token}`,
    { password },
    {
      [contentType]: applicationJson
    }
  );
};

export const validateToken = token =>
  Axios.get(`${API_BASE_URL}/password/recovery/${token}`);

export const activateAccount = token => {
  return Axios.get(`${API_BASE_URL}/account/activation/${token}`);
};

export const testToken = token =>
  Axios.get(`${API_BASE_URL}/is-signed-in`, {
    headers: { "X-Auth-Token": token }
  });
