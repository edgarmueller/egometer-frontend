import React from "react";
import moment from "moment";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DateNavigator, { formatPeriod } from "./DateNavigator";
import { renderWithProviders } from "../../test-utils";

describe("formatPeriod", () => {
  it("formats days, weeks and months", () => {
    expect(formatPeriod(moment("2026-10-18"), "day")).toBe("Sun, Oct 18, 2026");
    expect(formatPeriod(moment("2026-10-14"), "week")).toBe(
      "Oct 12 – 18, 2026"
    );
    expect(formatPeriod(moment("2026-09-30"), "week")).toBe(
      "Sep 28 – Oct 4, 2026"
    );
    expect(formatPeriod(moment("2026-10-18"), "month")).toBe("October 2026");
  });
});

describe("DateNavigator", () => {
  const renderNavigator = (unit, date) => {
    const onChange = vi.fn();
    renderWithProviders(
      <DateNavigator unit={unit} date={moment(date)} onChange={onChange} />
    );
    return onChange;
  };
  const changedTo = (onChange) =>
    onChange.mock.calls.at(-1)[0].format("YYYY-MM-DD");

  it("steps to the previous and next week", async () => {
    const onChange = renderNavigator("week", "2026-10-14");
    await userEvent.click(
      screen.getByRole("button", { name: "Previous week" })
    );
    expect(changedTo(onChange)).toBe("2026-10-05");
    await userEvent.click(screen.getByRole("button", { name: "Next week" }));
    expect(changedTo(onChange)).toBe("2026-10-19");
  });

  it("goes back to the current period", async () => {
    const onChange = renderNavigator("month", "2020-01-15");
    await userEvent.click(screen.getByRole("button", { name: "This month" }));
    expect(changedTo(onChange)).toBe(
      moment().startOf("month").format("YYYY-MM-DD")
    );
  });

  it("is already at the current day", () => {
    renderNavigator("day", moment());
    expect(screen.getByRole("button", { name: "Today" })).toBeDisabled();
  });

  it("picks a day from a calendar", async () => {
    const onChange = renderNavigator("day", "2026-10-18");
    await userEvent.click(
      screen.getByRole("button", { name: "Sun, Oct 18, 2026" })
    );
    await userEvent.click(screen.getByRole("gridcell", { name: "21" }));
    expect(changedTo(onChange)).toBe("2026-10-21");
  });
});
