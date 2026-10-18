import React from "react";
import moment from "moment";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route } from "react-router-dom";
import DailyDashboard from "./DailyDashboard";
import WeeklyDashboard from "./WeeklyDashboard";
import MonthlyDashboard from "./MonthlyDashboard";
import { renderWithProviders, storeState } from "../../test-utils";
import { FETCH_ENTRIES_REQUEST } from "../../actions";

const meters = [
  { id: "m", name: "Mood", type: "mood" },
  { id: "j", name: "Journal", type: "text" },
];
const entries = {
  m: [{ id: "e", meterId: "m", date: "2026-10-14", value: "good" }],
};

const renderAt = (path, routePath, Dashboard, state = { meters, entries }) =>
  renderWithProviders(<Route path={routePath} component={Dashboard} />, {
    path,
    state: storeState(state),
  });

describe("DailyDashboard", () => {
  const route = "/dashboard/:year?/:month?/:day?";

  it("shows the entries of the day and fetches the month's entries", () => {
    const { store } = renderAt("/dashboard/2026/10/14", route, DailyDashboard);
    expect(
      screen.getByRole("heading", { name: "Wednesday" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Good" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("textbox", { name: "Journal" })).toHaveValue("");
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: FETCH_ENTRIES_REQUEST,
        year: 2026,
        month: 10,
      })
    );
  });

  it("shows today by default", () => {
    renderAt("/dashboard", route, DailyDashboard);
    expect(screen.getByRole("heading", { name: "Today" })).toBeInTheDocument();
  });

  it("navigates to other days", async () => {
    renderAt("/dashboard/2026/10/14", route, DailyDashboard);
    await userEvent.click(screen.getByRole("button", { name: "Next day" }));
    expect(
      screen.getByRole("heading", { name: "Thursday" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Good" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("invites to add meters", () => {
    renderAt("/dashboard", route, DailyDashboard, { meters: [] });
    expect(screen.getByRole("link", { name: "Add a meter" })).toHaveAttribute(
      "href",
      "/meters"
    );
  });
});

describe("WeeklyDashboard", () => {
  it("shows the entries of an ISO week", () => {
    const { store } = renderAt(
      "/weekly/2026/42",
      "/weekly/:year?/:week?",
      WeeklyDashboard
    );
    expect(
      screen.getByRole("heading", { name: "Week 42" })
    ).toBeInTheDocument();
    expect(screen.getByText("Oct 12 – 18, 2026")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mood, Wed, Oct 14" })
    ).toBeInTheDocument();
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: FETCH_ENTRIES_REQUEST,
        year: 2026,
        week: 42,
      })
    );
  });

  it("shows the current week by default", () => {
    renderAt("/weekly", "/weekly/:year?/:week?", WeeklyDashboard);
    expect(
      screen.getByRole("heading", { name: `Week ${moment().isoWeek()}` })
    ).toBeInTheDocument();
  });
});

describe("MonthlyDashboard", () => {
  it("shows the entries of a month", () => {
    renderAt("/matrix/2026/2", "/matrix/:year?/:month?", MonthlyDashboard);
    expect(
      screen.getByRole("heading", { name: "February" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mood, Sat, Feb 28" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Mar 1$/ })).toBeNull();
  });
});
