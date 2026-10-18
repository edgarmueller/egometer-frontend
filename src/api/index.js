import Axios from "axios";
import { API_BASE_URL } from "../constants";
import _ from "lodash";
import moment from "moment";
import { getToken } from "./session";
import { lastDayOfMonth, pad, weekToDate } from "../common/date";

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

// only adds the Authorization header if there's a token, so that a request
// without one isn't mistaken for a rejected login (see the interceptor)
const createHeaders = (headers) => (token) => ({
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
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

// the local calendar day, which is what the dashboards show
const toDateString = (date) => moment(date).format("YYYY-MM-DD");

export const fetchEntriesInRange = async (from, to) => {
  const token = getToken();
  return Axios.get(
    `${API_BASE_URL}/entries?from=${from}&to=${to}`,
    createHeaders()(token)
  );
};

// month is 1-based
export const fetchEntries = async (year, month) => {
  const y = Number(year);
  const m = Number(month);
  return fetchEntriesInRange(
    `${y}-${pad(m)}-01`,
    `${y}-${pad(m)}-${pad(lastDayOfMonth(m, y))}`
  );
};

// ISO week
export const fetchEntriesByWeek = async (year, week) => {
  const monday = weekToDate(Number(year), Number(week));
  const sunday = new Date(monday.getTime());
  sunday.setDate(monday.getDate() + 6);
  return fetchEntriesInRange(toDateString(monday), toDateString(sunday));
};

export const createMeter = async (type, name, color) => {
  const token = getToken();
  return Axios.post(
    `${API_BASE_URL}/meters`,
    { type, name, color },
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const deleteMeter = async (meterId) => {
  const token = getToken();
  return Axios.delete(
    `${API_BASE_URL}/meters/${meterId}`,
    createHeaders()(token)
  );
};

// fields of a meter that can be changed; goals only apply to number meters
const EDITABLE_FIELDS = ["name", "color", "icon"];
const NUMBER_FIELDS = ["dailyGoal", "weeklyGoal"];

export const updateMeter = async (meter) => {
  const token = getToken();
  const fields = EDITABLE_FIELDS.concat(
    meter.type === "number" ? NUMBER_FIELDS : [],
    meter.type === "activities" ? ["options"] : []
  );
  const changes = _.pick(meter, fields);
  // goals must be positive; anything else (e.g. 0 from an emptied input)
  // removes the goal
  NUMBER_FIELDS.filter((field) => _.has(changes, field)).forEach((field) => {
    if (!(changes[field] > 0)) {
      changes[field] = null;
    }
  });
  return Axios.patch(
    `${API_BASE_URL}/meters/${meter.id}`,
    changes,
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

export const updateEntry = async ({ meterId, date, value }) => {
  const token = getToken();
  return Axios.put(
    `${API_BASE_URL}/meters/${meterId}/entries/${date}`,
    { value },
    createHeaders({
      [contentType]: applicationJson,
    })(token)
  );
};

// resolves with the deleted entry, as the API responds without a body
export const deleteEntry = async (entry) => {
  const token = getToken();
  await Axios.delete(
    `${API_BASE_URL}/meters/${entry.meterId}/entries/${entry.date}`,
    createHeaders()(token)
  );
  return { data: entry };
};
