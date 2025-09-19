// redux/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios"; // your axios instance

// --- Load from localStorage on init ---
const userFromStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

const tokenFromStorage = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : null;

// ========================
// 🔹 Thunks
// ========================

export const signUp = createAsyncThunk("user/signUp", async (userData, thunkAPI) => {
    try {
        const res = await api.post("/users/signup", userData);
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message || "An error occurred"
        );
    }
});

export const signIn = createAsyncThunk("user/signIn", async (credentials, thunkAPI) => {
    try {
        const res = await api.post("/users/signin", credentials);
        console.log("🔍 signIn response:", res.data); // { success, token, user }
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message || "An error occurred"
        );
    }
});

export const updateUser = createAsyncThunk("user/updateUser", async (userData, thunkAPI) => {
    try {
        const res = await api.put("/users/update", userData);
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message || "An error occurred"
        );
    }
});

export const signOutUser = createAsyncThunk("user/signOut", async (_, thunkAPI) => {
    try {
        await api.get("/users/logout");
        return null;
    } catch (err) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message || "An error occurred"
        );
    }
});

export const deleteUser = createAsyncThunk("user/deleteUser", async (_, thunkAPI) => {
    try {
        await api.delete("/users/delete");
        return null;
    } catch (err) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message || "An error occurred"
        );
    }
});

export const forgotPassword = createAsyncThunk("user/forgotPassword", async (userData, thunkAPI) => {
    try {
        const res = await api.post("/users/forgot-pass", userData);
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message || "An error occurred"
        );
    }
});

export const resetPassword = createAsyncThunk(
    "user/resetPassword",
    async ({ token, password }, thunkAPI) => {
        try {
            const res = await api.post(`/users/reset-pass/${token}`, { password });
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message || "An error occurred"
            );
        }
    }
);

export const getCurrentUser = createAsyncThunk("user/getCurrentUser", async (_, thunkAPI) => {
    try {
        const res = await api.get("/users/user-profile");
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message || "An error occurred"
        );
    }
});

// ========================
// 🔹 Initial state
// ========================
const initialState = {
    currentUser: userFromStorage,
    token: tokenFromStorage,
    error: null,
    loading: false,
    success: false,
};

// ========================
// 🔹 Slice
// ========================
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // --- Sign Up ---
            .addCase(signUp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currentUser = action.payload.user || action.payload; // API may return user directly
                state.token = action.payload.token || null;

                // ✅ Save new user to localStorage
                if (action.payload.user) {
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                }
                if (action.payload.token) {
                    localStorage.setItem("token", action.payload.token);
                }
            })
            .addCase(signUp.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // --- Sign In ---
            .addCase(signIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                console.log("🟢 signIn.fulfilled payload:", action.payload);
                state.currentUser = action.payload.user;
                state.token = action.payload.token;
                state.loading = false;
                state.error = null;

                // ✅ Save to localStorage
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(signIn.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // --- Update User ---
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.currentUser = action.payload.user || action.payload;
                state.loading = false;

                // ✅ Update localStorage
                localStorage.setItem("user", JSON.stringify(state.currentUser));
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // --- Sign Out ---
            .addCase(signOutUser.fulfilled, (state) => {
                state.currentUser = null;
                state.token = null;
                state.loading = false;
                state.error = null;

                // ✅ Clear localStorage
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            })

            // --- Delete User ---
            .addCase(deleteUser.fulfilled, (state) => {
                state.currentUser = null;
                state.token = null;
                state.loading = false;
                state.error = null;

                // ✅ Clear localStorage
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            })

            // --- Forgot Password ---
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // --- Reset Password ---
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // --- Get Current User ---
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.currentUser = action.payload.user || action.payload;
                // ✅ Keep token in state
                localStorage.setItem("user", JSON.stringify(state.currentUser));
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.currentUser = null;
            });
    },
});

export default userSlice.reducer;
