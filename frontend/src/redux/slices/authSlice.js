import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

let isValid = false;
if (storedToken) {
  try {
    const decoded = jwtDecode(storedToken);
    if (decoded.exp * 1000 > Date.now()) {
      isValid = true;
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  } catch (err) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}

const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedUser,
};

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        login: (state, action) => {

            const { user, token } = action.payload;

            state.user = user;
            state.isAuthenticated = true;

            // Store user
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // Store JWT token
            localStorage.setItem(
                "token",
                token
            );
        },


        logout: (state) => {

            state.user = null;
            state.isAuthenticated = false;

            // Remove user
            localStorage.removeItem("user");

            // Remove JWT
            localStorage.removeItem("token");
        },

    },

});

export const {
    login,
    logout
} = authSlice.actions;

export default authSlice.reducer;