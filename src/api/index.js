import Axios from "axios";
import { API_BASE_URL } from "../constants";

const contentType = "Content-Type";
const applicationJson = "application/json";

const createHeaders = (headers) => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("egometer.token")}`,
    ...headers,
  },
});

export const fetchMeters = () =>
  Axios.get(`${API_BASE_URL}/meters`, createHeaders());

export const fetchSchemas = () =>
  Axios.get(
    `${API_BASE_URL}/schemas`,
    createHeaders({
      [contentType]: applicationJson,
    })
  );

export const fetchEntries = (year, month) => {
  return Axios.get(
    `${API_BASE_URL}/entries?year=${year}&month=${month}`,
    createHeaders({
      [contentType]: applicationJson,
    })
  );
};

export const fetchEntriesByWeek = (year, week) => {
  return Axios.get(
    `${API_BASE_URL}/entries?year=${year}&week=${week}`,
    createHeaders({
      [contentType]: applicationJson,
    })
  );
};

export const createMeter = (schemaId, name, widget, color) =>
  Axios.post(
    `${API_BASE_URL}/meters`,
    {
      schemaId,
      name,
      widget,
      color,
    },
    createHeaders({
      [contentType]: applicationJson,
    })
  );

// TODO
export const deleteMeter = (meterId) =>
  Axios.delete(
    `${API_BASE_URL}/meters/${meterId}`,
    createHeaders({
      [contentType]: applicationJson,
    })
  );

export const updateMeter = (meter) =>
  Axios.patch(
    `${API_BASE_URL}/meters/${meter.id}`,
    {
      ...meter,
      widget: meter.widget,
    },
    createHeaders({
      [contentType]: applicationJson,
    })
  );

// TODO
export const deleteSchema = (schema) =>
  Axios.delete(
    `${API_BASE_URL}/schemas/${schema.id}`,
    createHeaders({
      [contentType]: applicationJson,
    })
  );

export const updateEntry = ({ meterId, date, value }) => {
  return Axios.put(
    `${API_BASE_URL}/entries/${date}/${meterId}`,
    { value },
    createHeaders({
      [contentType]: applicationJson,
    })
  );
};

// TODO
export const deleteEntry = (entry) =>
  Axios.delete(`${API_BASE_URL}/entries/${entry.id}`, createHeaders());

// TODO: this should overwrite the value on the server
export const submitSchema = (name, schema) =>
  Axios.post(
    `${API_BASE_URL}/schemas`,
    {
      name,
      schema,
    },
    createHeaders({
      [contentType]: applicationJson,
    })
  );

export const loginUser = (email, password, rememberMe) =>
  Axios.post(
    `${API_BASE_URL}/auth/login`,
    { email, password },
    createHeaders()
  );

// TODO
export const logout = () =>
  Axios.post(`${API_BASE_URL}/sign-out`, undefined, createHeaders()).then(() =>
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

export const resendVerificationMail = (email) => {
  return Axios.get(`${API_BASE_URL}/auth/resend-verification/${email}`);
};

// TODO
export const validateToken = (token) =>
  Axios.get(`${API_BASE_URL}/auth/forgot-password/verify/${token}`);

export const activateAccount = (token) => {
  const resp = Axios.get(`${API_BASE_URL}/auth/email/verify/${token}`);
  console.log(resp);
  return resp;
};
