export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://egometer-backend.herokuapp.com"
    : "http://localhost:9000";

export const NOT_APPLICABLE = -1;

export const LAYOUT_STORAGE_KEY = "egometer.layout";
