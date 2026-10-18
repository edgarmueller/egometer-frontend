import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorSnackbar, errorMessage } from "./ErrorSnackbar";

describe("ErrorSnackbar", () => {
  it("finds the message of the errors in the store", () => {
    expect(errorMessage(undefined)).toBeUndefined();
    expect(errorMessage("failed")).toBe("failed");
    expect(errorMessage({ message: "failed" })).toBe("failed");
    expect(errorMessage({ message: new Error("failed") })).toBe("failed");
  });

  it("shows errors until closed", async () => {
    const onClose = vi.fn();
    render(<ErrorSnackbar error={{ message: "failed" }} onClose={onClose} />);
    expect(screen.getByRole("alert")).toHaveTextContent("failed");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });
});
