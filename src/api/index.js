import Axios from "axios";
import { API_BASE_URL } from "../constants";
import { getToken } from "./session";

const contentType = "Content-Type";
const applicationJson = "application/json";

// eslint-disable-next-line no-undef
const unauthorizedListeners = new Set();

/**
 * Registers a callback that is invoked whenever an authenticated request
 * is rejected by the API, e.g. because the token has expired.
 * Returns a function to unregister the callback.
 */
export const onUnauthorized = (listener) => {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
};

Axios.interceptors.response.use(undefined, (error) => {
  const { config, response } = error;
  const hadToken =
    config && config.headers && config.headers.Authorization !== undefined;
  if (response && response.status === 401 && hadToken) {
    unauthorizedListeners.forEach((listener) => listener());
  }
  // eslint-disable-next-line no-undef
  return Promise.reject(error);
});

const createHeaders = (headers) => (token) => ({
  headers: {
    // eslint-disable-next-line no-undef
    Authorization: `Bearer ${token}`,
    ...headers,
  },
});

export const login = (email, password) =>
  Axios.post(
    `${API_BASE_URL}/auth/login`,
    { email, password },
    { headers: { [contentType]: applicationJson } }
  );

export const signUp = (email, password) =>
  Axios.post(
    `${API_BASE_URL}/auth/signup`,
    { email, password },
    { headers: { [contentType]: applicationJson } }
  );

export const fetchMeters = async () => {
  const token = getToken();
  return Axios.get(`${API_BASE_URL}/meters`, createHeaders()(token));
};

export const fetchSchemas = async () => {
  const token = getToken();
  return Axios.get(
    `${API_BASE_URL}/schemas`,
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const fetchEntries = async (year, month) => {
  const token = getToken();
  return Axios.get(
    `${API_BASE_URL}/entries?year=${year}&month=${month}`,
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const fetchEntriesByWeek = async (year, week) => {
  const token = getToken();
  return Axios.get(
    `${API_BASE_URL}/entries?year=${year}&week=${week}`,
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const createMeter = async (schemaId, name, widget, color) => {
  const token = getToken();
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

export const deleteMeter = async (meterId) => {
  const token = getToken();
  return Axios.delete(
    `${API_BASE_URL}/meters/${meterId}`,
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const updateMeter = async (meter) => {
  const token = getToken();
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
  const token = getToken();
  return Axios.delete(
    `${API_BASE_URL}/schemas/${schema.id}`,
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const updateEntry = async ({ meterId, date, value }) => {
  const token = getToken();
  return Axios.put(
    `${API_BASE_URL}/entries/${date}/${meterId}`,
    { value },
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const deleteEntry = async (entry) => {
  const token = getToken();
  return Axios.delete(
    `${API_BASE_URL}/entries/${entry.id}`,
    createHeaders()(token)
  );
};

// TODO: this should overwrite the value on the server
export const submitSchema = async (name, schema) => {
  const token = getToken();
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
