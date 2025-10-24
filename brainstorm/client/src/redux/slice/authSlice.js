import { createSlice } from "@reduxjs/toolkit";

// Helper functions to safely handle localStorage
const loadUserFromStorage = () => {
  try {
    const serializedUser = localStorage.getItem("user");
    if (serializedUser === null) {
      return null;
    }
    return JSON.parse(serializedUser);
  } catch (err) {
    console.error("Error loading user from localStorage:", err);
    return null;
  }
};

const saveUserToStorage = (user) => {
  try {
    const serializedUser = JSON.stringify(user);
    localStorage.setItem("user", serializedUser);
  } catch (err) {
    console.error("Error saving user to localStorage:", err);
  }
};

const removeUserFromStorage = () => {
  try {
    localStorage.removeItem("user");
  } catch (err) {
    console.error("Error removing user from localStorage:", err);
  }
};

const initialState = {
  user: loadUserFromStorage(), // Load user from localStorage on init
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      // Persist to localStorage
      saveUserToStorage(action.payload);
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
      removeUserFromStorage();
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.isLoading = false;
      // Remove from localStorage
      removeUserFromStorage();
    },
    setUser: (state, action) => {
      state.user = action.payload;
      // Persist to localStorage
      saveUserToStorage(action.payload);
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser } = authSlice.actions;
export default authSlice.reducer;