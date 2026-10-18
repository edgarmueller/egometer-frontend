import React from "react";
import { screen } from "@testing-library/react";
import { App } from "./App";
import { renderWithProviders } from "../test-utils";
import { useAuth } from "./auth/AuthProvider";

vi.mock("./auth/AuthProvider", async (importOriginal) => ({
  ...(await importOriginal()),
  useAuth: vi.fn(),
}));

describe("App", () => {
  it("shows the login page to visitors", async () => {
    useAuth.mockReturnValue({ isAuthenticated: false });
    const fetchMeters = vi.fn();
    renderWithProviders(<App fetchMeters={fetchMeters} />, {
      path: "/dashboard",
    });
    expect(await screen.findByText("Welcome back")).toBeInTheDocument();
    expect(fetchMeters).not.toHaveBeenCalled();
  });

  it("fetches the meters of logged in users", async () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: {} });
    const fetchMeters = vi.fn();
    renderWithProviders(<App fetchMeters={fetchMeters} />, { path: "/meters" });
    expect(
      await screen.findByRole("heading", { name: "Meters" })
    ).toBeInTheDocument();
    expect(fetchMeters).toHaveBeenCalled();
  });
});
