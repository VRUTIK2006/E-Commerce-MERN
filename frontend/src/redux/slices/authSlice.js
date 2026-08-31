import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");

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