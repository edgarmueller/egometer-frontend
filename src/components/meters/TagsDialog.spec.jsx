import React from "react";
import { render, screen, within } from "@testing-library/react";
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
  const renderDialog = (onSave, tags = ["work", "music"]) =>
    render(
      <TagsDialog
        open
        meterName="Activities"
        tags={tags}
        onSave={onSave}
        onClose={vi.fn()}
      />
    );
  const addTag = async (tag) => {
    await userEvent.type(screen.getByLabelText("New tag"), tag);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
  };
  const chip = (label) => screen.getByText(label).closest(".MuiChip-root");

  it("adds and removes tags", async () => {
    const onSave = vi.fn();
    renderDialog(onSave);
    await addTag(" Yoga & stretching ");
    await userEvent.click(within(chip("Work")).getByTestId("CancelIcon"));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledWith(["music", "Yoga & stretching"]);
  });

  it("keeps at least one tag", () => {
    renderDialog(vi.fn(), ["work"]);
    expect(within(chip("Work")).queryByTestId("CancelIcon")).toBeNull();
  });

  it("doesn't add duplicates", async () => {
    const onSave = vi.fn();
    renderDialog(onSave);
    await userEvent.type(screen.getByLabelText("New tag"), "Music");
    expect(screen.getByText("This tag already exists")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledWith(["work", "music"]);
  });
});
