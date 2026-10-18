import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppShell from "./AppShell";
import { renderWithProviders } from "../../test-utils";
import { useAuth } from "../auth/AuthProvider";

vi.mock("../auth/AuthProvider");

describe("AppShell", () => {
  const logout = vi.fn();
  beforeEach(() => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { email: "me@example.com" },
      logout,
    });
  });

  it("shows the page next to the navigation", () => {
    renderWithProviders(<AppShell>the page</AppShell>, {
      path: "/weekly/2026/42",
    });
    expect(screen.getByText("the page")).toBeInTheDocument();
    // the navigation is rendered for wide and narrow screens
    const [week] = screen.getAllByRole("link", { name: "Week" });
    expect(week).toHaveClass("Mui-selected");
    const [today] = screen.getAllByRole("link", { name: "Today" });
    expect(today).not.toHaveClass("Mui-selected");
    expect(screen.getAllByText("me@example.com")[0]).toBeInTheDocument();
  });

  it("logs out", async () => {
    renderWithProviders(<AppShell />, { path: "/meters" });
    await userEvent.click(
      screen.getAllByRole("button", { name: "Log out" })[0]
    );
    expect(logout).toHaveBeenCalled();
  });
});
