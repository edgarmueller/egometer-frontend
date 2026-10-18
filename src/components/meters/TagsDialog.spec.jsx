import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagsDialog, { validateTag } from "./TagsDialog";

describe("validateTag", () => {
  it("validates new tags", () => {
    expect(validateTag("Yoga", ["work"])).toBeUndefined();
    expect(validateTag("Work", ["work"])).toEqual(expect.any(String));
    expect(validateTag("x".repeat(51), ["work"])).toEqual(expect.any(String));
  });
});

describe("TagsDialog", () => {
  const renderDialog = (onSave, tags = ["work", "music"], goals = []) =>
    render(
      <TagsDialog
        open
        meterName="Activities"
        tags={tags}
        goals={goals}
        onSave={onSave}
        onClose={vi.fn()}
      />
    );
  const addTag = async (tag) => {
    await userEvent.type(screen.getByLabelText("New tag"), tag);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
  };
  const save = () =>
    userEvent.click(screen.getByRole("button", { name: "Save" }));

  it("adds and removes tags", async () => {
    const onSave = vi.fn();
    renderDialog(onSave);
    await addTag(" Yoga & stretching ");
    await userEvent.click(screen.getByRole("button", { name: "Remove Work" }));
    await save();
    expect(onSave).toHaveBeenCalledWith(["music", "Yoga & stretching"], []);
  });

  it("keeps at least one tag", () => {
    renderDialog(vi.fn(), ["work"]);
    expect(screen.getByRole("button", { name: "Remove Work" })).toBeDisabled();
  });

  it("doesn't add duplicates", async () => {
    const onSave = vi.fn();
    renderDialog(onSave);
    await userEvent.type(screen.getByLabelText("New tag"), "Music");
    expect(screen.getByText("This tag already exists")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
    await save();
    expect(onSave).toHaveBeenCalledWith(["work", "music"], []);
  });

  it("sets goals per tag, dropping those of removed tags", async () => {
    const onSave = vi.fn();
    renderDialog(onSave, ["work", "music"], [{ tag: "work", timesPerWeek: 5 }]);
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
        { tag: "work", timesPerWeek: 5 },
        { tag: "music", timesPerWeek: 3 },
      ]
    );
  });
});
