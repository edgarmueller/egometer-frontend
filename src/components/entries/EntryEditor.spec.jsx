import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EntryEditor from "./EntryEditor";
import { renderWithProviders } from "../../test-utils";
import { DELETE_ENTRY_REQUEST, UPDATE_ENTRY_REQUEST } from "../../actions";

const mood = { id: "m", name: "Mood", type: "mood" };
const date = "2026-10-18";

describe("EntryEditor", () => {
  it("saves picked values", async () => {
    const { store } = renderWithProviders(
      <EntryEditor meter={mood} date={date} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Good" }));
    expect(store.getActions()).toEqual([
      {
        type: UPDATE_ENTRY_REQUEST,
        entry: { meterId: "m", date, value: "good" },
        shouldDebounce: false,
      },
    ]);
  });

  it("deletes entries that are cleared", async () => {
    const entry = { id: "e", meterId: "m", date, value: "good" };
    const { store } = renderWithProviders(
      <EntryEditor meter={mood} date={date} entry={entry} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Good" }));
    expect(store.getActions()).toEqual([
      {
        type: DELETE_ENTRY_REQUEST,
        meterId: "m",
        entry,
        shouldDebounce: false,
      },
    ]);
  });

  it("saves typed values after a pause", async () => {
    const journal = { id: "j", name: "Journal", type: "text" };
    const { store } = renderWithProviders(
      <EntryEditor meter={journal} date={date} />
    );
    await userEvent.type(screen.getByRole("textbox"), "A");
    expect(store.getActions()).toEqual([
      {
        type: UPDATE_ENTRY_REQUEST,
        entry: { meterId: "j", date, value: "A" },
        shouldDebounce: true,
      },
    ]);
  });
});
