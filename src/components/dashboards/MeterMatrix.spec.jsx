import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MeterMatrix from "./MeterMatrix";
import { renderWithProviders } from "../../test-utils";

const days = [...Array(7)].map((_, i) => new Date(2026, 9, 12 + i));
const meters = [
  { id: "m", name: "Mood", type: "mood" },
  { id: "n", name: "Pages", type: "number", dailyGoal: 10, weeklyGoal: 2 },
];
const entriesByMeter = {
  m: [{ id: "e1", meterId: "m", date: "2026-10-12", value: "great" }],
  n: [
    { id: "e2", meterId: "n", date: "2026-10-13", value: 12 },
    { id: "e3", meterId: "n", date: "2026-10-14", value: 3 },
  ],
};

describe("MeterMatrix", () => {
  const renderMatrix = () =>
    renderWithProviders(
      <MeterMatrix
        meters={meters}
        days={days}
        entriesByMeter={entriesByMeter}
      />
    );

  it("shows the entries of each meter per day", () => {
    renderMatrix();
    expect(screen.getAllByRole("row")).toHaveLength(3);
    const cell = screen.getByRole("button", { name: "Mood, Mon, Oct 12" });
    expect(cell.querySelector("svg")).toHaveAttribute(
      "data-testid",
      "SentimentVerySatisfiedRoundedIcon"
    );
    expect(
      screen.getByRole("button", { name: "Pages, Tue, Oct 13" })
    ).toHaveTextContent("12");
  });

  it("shows the progress towards weekly goals", () => {
    renderMatrix();
    expect(screen.getByText("Goals")).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("edits an entry within a popover", async () => {
    const { store } = renderMatrix();
    await userEvent.click(
      screen.getByRole("button", { name: "Mood, Wed, Oct 14" })
    );
    expect(screen.getByText("Wednesday, October 14")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Okay" }));
    expect(store.getActions()[0].entry).toEqual({
      meterId: "m",
      date: "2026-10-14",
      value: "okay",
    });
  });
});
