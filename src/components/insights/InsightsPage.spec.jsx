import React from "react";
import moment from "moment";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InsightsPage from "./InsightsPage";
import { renderWithProviders, storeState } from "../../test-utils";
import * as api from "../../api";

vi.mock("../../api");

const day = (n) => moment().subtract(n, "days").format("YYYY-MM-DD");

const meters = [
  { id: "m", name: "Mood", type: "mood" },
  { id: "a", name: "Activities", type: "activities", options: ["sports"] },
  { id: "b", name: "Workout", type: "boolean" },
];
// great days with sports, bad days without, over the last 8 days
const entries = [...Array(8)].flatMap((_, i) => [
  { meterId: "m", date: day(i), value: i % 2 ? "great" : "bad" },
  { meterId: "a", date: day(i), value: i % 2 ? ["sports"] : ["work"] },
  ...(i < 3 ? [{ meterId: "b", date: day(i), value: true }] : []),
]);

const renderPage = (state = { meters }) =>
  renderWithProviders(<InsightsPage />, { state: storeState(state) });

describe("InsightsPage", () => {
  beforeEach(() => {
    api.fetchEntriesInRange.mockResolvedValue({ data: entries });
  });

  it("fetches the entries of the last 90 days", async () => {
    renderPage();
    await screen.findByText("What goes along with your mood");
    expect(api.fetchEntriesInRange).toHaveBeenCalledWith(day(89), day(0));
  });

  it("shows how activities go along with the mood", async () => {
    renderPage();
    const sports = (await screen.findByText("Sports")).closest("li");
    expect(within(sports).getByText("+3.0")).toBeInTheDocument();
    const work = screen.getByText("Work").closest("li");
    expect(within(work).getByText("−3.0")).toBeInTheDocument();
  });

  it("shows tracking and yes/no streaks", async () => {
    renderPage();
    await screen.findByText("Streaks");
    expect(screen.getByText("Tracking streak").nextSibling).toHaveTextContent(
      "8 days"
    );
    const workout = screen.getAllByText("Workout").at(-1).closest("li");
    expect(within(workout).getByText("3 days")).toBeInTheDocument();
  });

  it("fetches other periods", async () => {
    renderPage();
    await screen.findByText("Streaks");
    await userEvent.click(screen.getByRole("button", { name: "Year" }));
    expect(api.fetchEntriesInRange).toHaveBeenLastCalledWith(day(364), day(0));
  });

  it("invites to track the mood without a mood meter", async () => {
    renderPage({ meters: meters.slice(1) });
    expect(
      await screen.findByRole("link", { name: "Add a mood meter" })
    ).toBeInTheDocument();
  });
});
