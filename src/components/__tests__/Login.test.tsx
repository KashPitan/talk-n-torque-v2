import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Auth from "../Login";
import { supabase } from "../../../lib/supabase";
import { Alert } from "react-native";
import { AuthError } from "@supabase/supabase-js";

// Mock the supabase client
jest.mock("../../../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      startAutoRefresh: jest.fn(),
      stopAutoRefresh: jest.fn(),
    },
  },
}));

const mockUser = {
  id: "mock-user-id",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2024-01-01T00:00:00.000Z",
};

const mockSession = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  token_type: "bearer",
  user: {
    id: "mock-user-id",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2024-01-01T00:00:00.000Z",
  },
};

describe("Auth Component", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    jest.clearAllMocks();
  });

  it("renders email and password inputs", () => {
    const { getByPlaceholderText } = render(<Auth />);

    expect(getByPlaceholderText("email@address.com")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
  });

  it("handles sign in with valid credentials", async () => {
    const mockSignIn = jest.spyOn(supabase.auth, "signInWithPassword");
    mockSignIn.mockResolvedValueOnce({
      data: {
        user: mockUser,
        session: mockSession,
      },
      error: null,
    });

    const { getByPlaceholderText, getByText } = render(<Auth />);

    const emailInput = getByPlaceholderText("email@address.com");
    const passwordInput = getByPlaceholderText("Password");
    const signInButton = getByText("Sign in");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  // TODO: fix this test
  it.skip("shows error alert when sign in fails", async () => {
    const mockSignIn = jest.spyOn(supabase.auth, "signInWithPassword");
    mockSignIn.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: new AuthError("Invalid credentials", 400, "invalid_credentials"),
    });

    const mockAlert = jest.spyOn(Alert, "alert");

    const { getByPlaceholderText, getByText } = render(<Auth />);

    const emailInput = getByPlaceholderText("email@address.com");
    const passwordInput = getByPlaceholderText("Password");
    const signInButton = getByText("Sign in");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "wrong");
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Invalid credentials");
    });
  });
});
