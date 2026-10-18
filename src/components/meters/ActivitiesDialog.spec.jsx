import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActivitiesDialog, { validateActivity } from "./ActivitiesDialog";

describe("validateActivity", () => {
  it("validates new activities", () => {
    expect(validateActivity("Yoga", ["work"])).toBeUndefined();
    expect(validateActivity("Work", ["work"])).toEqual(expect.any(String));
    expect(validateActivity("x".repeat(51), ["work"])).toEqual(
      expect.any(String)
    );
  });
});

describe("ActivitiesDialog", () => {
  const renderDialog = (onSave, activities = ["work", "music"], goals = []) =>
    render(
      <ActivitiesDialog
        open
        meterName="Activities"
        activities={activities}
        goals={goals}
        onSave={onSave}
        onClose={vi.fn()}
      />
    );
  const addActivity = async (activity) => {
    await userEvent.type(screen.getByLabelText("New activity"), activity);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
  };
  const save = () =>
    userEvent.click(screen.getByRole("button", { name: "Save" }));

  it("adds and removes activities", async () => {
    const onSave = vi.fn();
    renderDialog(onSave);
    await addActivity(" Yoga & stretching ");
    await userEvent.click(screen.getByRole("button", { name: "Remove Work" }));
    await save();
    expect(onSave).toHaveBeenCalledWith(["music", "Yoga & stretching"], []);
  });

  it("keeps at least one activity", () => {
    renderDialog(vi.fn(), ["work"]);
    expect(screen.getByRole("button", { name: "Remove Work" })).toBeDisabled();
  });

  it("doesn't add duplicates", async () => {
    const onSave = vi.fn();
    renderDialog(onSave);
    await userEvent.type(screen.getByLabelText("New activity"), "Music");
    expect(
      screen.getByText("This activity already exists")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
    await save();
    expect(onSave).toHaveBeenCalledWith(["work", "music"], []);
  });

  it("sets goals per activity, dropping those of removed activities", async () => {
    const onSave = vi.fn();
    renderDialog(
      onSave,
      ["work", "music"],
      [{ activity: "work", timesPerWeek: 5 }]
    );
    expect(
      screen.getByRole("combobox", { name: "Goal for Work" })
    ).toHaveTextContent("5× a week");
    await userEvent.click(
      screen.getByRole("combobox", { name: "Goal for Music" })
    );
    await userEvent.click(screen.getByRole("option", { name: "3× a week" }));
    await save();
    expect(onSave).toHaveBeenLastCalledWith(
      ["work", "music"],
      [
        { activity: "work", timesPerWeek: 5 },
        { activity: "music", timesPerWeek: 3 },
      ]
    );
  });
});
