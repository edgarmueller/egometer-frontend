import React from "react";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MonthCalendar from "./MonthCalendar";
import { renderWithProviders } from "../../test-utils";

// October 2026 starts on a Thursday
const days = [...Array(31)].map((_, i) => new Date(2026, 9, 1 + i));
const meter = {
  id: "n",
  name: "Pages",
  type: "number",
  color: "#ca8a04",
  dailyGoal: 10,
  weeklyGoal: 2,
};
const entries = [
  { id: "a", date: "2026-10-01", value: 5 },
  { id: "b", date: "2026-10-02", value: 20 },
];

describe("MonthCalendar", () => {
  const renderCalendar = (onEdit = vi.fn()) =>
    renderWithProviders(
      <MonthCalendar
        meter={meter}
        days={days}
        entries={entries}
        onEdit={onEdit}
      />
    );

  it("shows each day of the month, starting on its weekday", () => {
    const { container } = renderCalendar();
    const cells = screen.getAllByRole("button", { name: /^Pages, / });
    expect(cells).toHaveLength(31);
    // three columns before Thursday the 1st
    const offset = [...container.querySelectorAll("div")].find(
      (div) => getComputedStyle(div).gridColumn === "span 3"
    );
    expect(offset).toBeDefined();
    expect(within(cells[0]).getByText("1")).toBeInTheDocument();
    expect(cells[0]).toHaveAccessibleName("Pages, Thu, Oct 1");
  });

  it("summarizes the tracked days and the goal", () => {
    renderCalendar();
    expect(screen.getByText("2 of 31 days")).toBeInTheDocument();
    expect(screen.getByText("Goal 1 / 9")).toBeInTheDocument();
  });

  it("shades days by the intensity of their entries", () => {
    renderCalendar();
    const low = screen.getByRole("button", { name: "Pages, Thu, Oct 1" });
    const high = screen.getByRole("button", { name: "Pages, Fri, Oct 2" });
    const alphaOf = (el) =>
      Number(getComputedStyle(el).backgroundColor.match(/[\d.]+(?=\))/)[0]);
    expect(alphaOf(high)).toBeGreaterThan(alphaOf(low));
  });

  it("opens the editor of a day", async () => {
    const onEdit = vi.fn();
    renderCalendar(onEdit);
    await userEvent.click(
      screen.getByRole("button", { name: "Pages, Sat, Oct 3" })
    );
    expect(onEdit).toHaveBeenCalledWith(expect.anything(), meter, "2026-10-03");
  });
});
