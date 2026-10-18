/* eslint-disable no-undef */
import mockStorage from "../__mocks__/mockStorage";
import {
  clearSession,
  getStoredUser,
  getToken,
  isValidToken,
  saveSession,
} from "./session";

global.localStorage = mockStorage();

const base64url = (obj) =>
  Buffer.from(JSON.stringify(obj))
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const createToken = (exp) =>
  `${base64url({ alg: "HS256", typ: "JWT" })}.${base64url({
    sub: "1",
    exp,
  })}.signature`;

const now = () => Math.floor(Date.now() / 1000);

describe("session", () => {
  afterEach(() => clearSession());

  it("should store and clear the session", () => {
    const token = createToken(now() + 60);
    saveSession({ token, user: { email: "foo@example.com" } });
    expect(getToken()).toBe(token);
    expect(getStoredUser()).toEqual({ email: "foo@example.com" });
    clearSession();
    expect(getToken()).toBeUndefined();
    expect(getStoredUser()).toBeUndefined();
  });

  it("should treat expired or malformed tokens as invalid", () => {
    expect(isValidToken(createToken(now() + 60))).toBe(true);
    expect(isValidToken(createToken(now() - 60))).toBe(false);
    expect(isValidToken("not-a-token")).toBe(false);
    expect(isValidToken(undefined)).toBe(false);
  });
});
