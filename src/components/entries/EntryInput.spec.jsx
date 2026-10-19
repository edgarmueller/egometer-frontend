import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EntryInput from "./EntryInput";

const renderInput = (meter, value) => {
  const onChange = vi.fn();
  render(
    <EntryInput
      meter={{ name: "M", ...meter }}
      value={value}
      onChange={onChange}
    />
  );
  return onChange;
};

describe("EntryInput", () => {
  it("picks a mood and clears it when picked again", async () => {
    const onChange = renderInput({ type: "mood" }, undefined);
    await userEvent.click(screen.getByRole("button", { name: "Great" }));
    expect(onChange).toHaveBeenLastCalledWith("great");
  });

  it("clears a picked value when picked again", async () => {
    const onChange = renderInput({ type: "quantity" }, "a_bit");
    const button = screen.getByRole("button", { name: "A bit" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(button);
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("toggles the tags of an activities meter", async () => {
    const meter = { type: "activities", options: ["work", "music"] };
    const onChange = renderInput(meter, ["work", "removed tag"]);
    // tags removed from the meter are still shown for the day
    expect(screen.getByText("removed tag")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Music" }));
    expect(onChange).toHaveBeenLastCalledWith(["work", "removed tag", "music"]);
    await userEvent.click(screen.getByRole("button", { name: "Work" }));
    expect(onChange).toHaveBeenLastCalledWith(["removed tag"]);
  });

  it("switches yes/no meters", async () => {
    const onChange = renderInput({ type: "boolean" }, undefined);
    await userEvent.click(screen.getByRole("switch", { name: "M" }));
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it("edits numbers and shows reached goals", async () => {
    const onChange = renderInput({ type: "number", dailyGoal: 10 }, 5);
    const input = screen.getByRole("spinbutton", { name: "M" });
    expect(screen.getByText("Daily goal: 10")).toBeInTheDocument();
    await userEvent.clear(input);
    expect(onChange).toHaveBeenLastCalledWith(undefined);
    await userEvent.type(input, "12");
    expect(onChange).toHaveBeenLastCalledWith(12);
    expect(screen.getByTitle("Goal reached")).toBeInTheDocument();
  });

  it("edits notes, clearing blank ones", async () => {
    const onChange = renderInput({ type: "text" }, "");
    const input = screen.getByRole("textbox", { name: "M" });
    await userEvent.type(input, "Hi");
    expect(onChange).toHaveBeenLastCalledWith("Hi");
    await userEvent.clear(input);
    await userEvent.type(input, "  ");
    expect(onChange).toHaveBeenLastCalledWith(undefined);
  });

  it("shows existing notes as rendered Markdown", () => {
    renderInput(
      { type: "text" },
      "# Day\n\n- [x] **ran** 5k\n- see [notes](https://example.com)\n\n<b>raw</b>"
    );
    expect(screen.getByRole("button", { name: "Preview" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("heading", { name: "Day" })).toBeInTheDocument();
    expect(screen.getByText("ran").tagName).toBe("STRONG");
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(screen.getByRole("link", { name: "notes" })).toHaveAttribute(
      "target",
      "_blank"
    );
    // raw HTML isn't rendered
    expect(document.querySelector("b")).toBeNull();
  });

  it("switches from the preview to writing", async () => {
    const onChange = renderInput({ type: "text" }, "Hello *world*");
    await userEvent.click(screen.getByRole("button", { name: "Edit M" }));
    const input = screen.getByRole("textbox", { name: "M" });
    expect(input).toHaveValue("Hello *world*");
    expect(input).toHaveFocus();
    // the cursor is at the end of the note
    await userEvent.keyboard("!");
    expect(onChange).toHaveBeenLastCalledWith("Hello *world*!");
    await userEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByText("world").tagName).toBe("EM");
  });
});
