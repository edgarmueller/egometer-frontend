import React from "react";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MeterList } from "./MeterList";
import { renderWithProviders } from "../../test-utils";
import * as api from "../../api";

vi.mock("../../api");

const meters = [
  { id: "m", name: "Mood", type: "mood", color: "#4f46e5" },
  { id: "a", name: "Hobbies", type: "activities", options: ["work"] },
  { id: "n", name: "Steps", type: "number", dailyGoal: 1000 },
];

const renderList = (props = {}) => {
  const actions = {
    deleteMeter: vi.fn(),
    updateMeterRequest: vi.fn(),
    resetMetersError: vi.fn(),
    fetchMeters: vi.fn(),
  };
  renderWithProviders(<MeterList meters={meters} {...actions} {...props} />);
  return actions;
};

describe("MeterList", () => {
  it("lists the meters with their types", () => {
    renderList();
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(4);
    expect(within(rows[2]).getByDisplayValue("Hobbies")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Activities")).toBeInTheDocument();
    // goals and tags only for the meters they apply to
    expect(within(rows[3]).getByLabelText("Daily goal")).toHaveValue(1000);
    expect(within(rows[1]).queryByLabelText("Daily goal")).toBeNull();
    expect(screen.getAllByRole("button", { name: "Edit tags" })).toHaveLength(
      1
    );
  });

  it("renames meters", async () => {
    const { updateMeterRequest } = renderList();
    await userEvent.type(screen.getByDisplayValue("Mood"), "!");
    expect(updateMeterRequest).toHaveBeenLastCalledWith({
      ...meters[0],
      name: "Mood!",
    });
    expect(screen.getByDisplayValue("Mood!")).toBeInTheDocument();
  });

  it("deletes meters after confirming", async () => {
    const { deleteMeter } = renderList();
    const [, , steps] = screen.getAllByRole("button", { name: "Delete meter" });
    await userEvent.click(steps);
    expect(screen.getByText("Delete Steps?")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(deleteMeter).toHaveBeenCalledWith("n");
  });

  it("adds meters of a type", async () => {
    api.createMeter.mockResolvedValue({ data: {} });
    const { fetchMeters } = renderList();
    await userEvent.click(screen.getByRole("button", { name: "Add meter" }));
    await userEvent.click(screen.getByRole("button", { name: "Yes / No" }));
    expect(api.createMeter).toHaveBeenCalledWith(
      "boolean",
      "Yes / No",
      expect.stringMatching(/^#/)
    );
    expect(fetchMeters).toHaveBeenCalled();
  });

  it("invites to add a first meter", () => {
    renderList({ meters: [] });
    expect(screen.getByText("No meters yet")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add meter" })
    ).toBeInTheDocument();
  });
});
