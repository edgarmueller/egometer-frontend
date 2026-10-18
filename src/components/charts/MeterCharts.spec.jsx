import React from "react";
import { render, screen } from "@testing-library/react";
import MeterCharts, { BooleanChart, NumberChart } from "./MeterCharts";

const days = [...Array(7)].map((_, i) => new Date(2026, 9, 5 + i));

describe("MeterCharts", () => {
  it("shows a chart for each meter but journals", () => {
    const meters = [
      { id: "m", name: "Mood", type: "mood" },
      { id: "j", name: "Journal", type: "text" },
      { id: "b", name: "Workout", type: "boolean" },
    ];
    render(<MeterCharts meters={meters} days={days} entriesByMeter={{}} />);
    expect(screen.getByText("Mood")).toBeInTheDocument();
    expect(screen.getByText("Workout")).toBeInTheDocument();
    expect(screen.queryByText("Journal")).toBeNull();
    expect(screen.getByText("Nothing tracked yet")).toBeInTheDocument();
  });

  it("summarizes numbers", () => {
    const entries = [
      { date: "2026-10-05", value: 2 },
      { date: "2026-10-06", value: 4 },
    ];
    render(
      <NumberChart
        meter={{ name: "Steps", type: "number", dailyGoal: 3 }}
        days={days}
        entries={entries}
      />
    );
    expect(screen.getByText("Average").nextSibling).toHaveTextContent("3");
    expect(screen.getByText("Min").nextSibling).toHaveTextContent("2");
    expect(screen.getByText("Max").nextSibling).toHaveTextContent("4");
    expect(screen.getByText("Daily goal").nextSibling).toHaveTextContent("3");
  });

  it("counts the days of yes/no meters", () => {
    const entries = [
      { date: "2026-10-05", value: true },
      { date: "2026-10-06", value: true },
    ];
    render(
      <BooleanChart
        meter={{ name: "Workout", type: "boolean" }}
        days={days}
        entries={entries}
      />
    );
    expect(
      screen.getByRole("progressbar", { name: "Workout: 2 of 7 days" })
    ).toHaveAttribute("aria-valuenow", String((2 / 7) * 100));
  });
});
