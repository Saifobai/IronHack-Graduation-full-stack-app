import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllUsers = createAsyncThunk(
    "admin/fetchAllUsers",
    async (token, thunkAPI) => {
        try {
            const res = await fetch("http://localhost:5000/api/users/all-users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                // If the response is not OK, throw an error to trigger the rejected state
                const errorData = await res.json();
                return thunkAPI.rejectWithValue(errorData.message);
            }

            const data = await res.json();
            return data.users;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



// ✅ Fetch job stats (admin only)
export const fetchJobStats = createAsyncThunk(
    "admin/fetchJobStats",
    async (token, thunkAPI) => {
        try {
            const res = await fetch("http://localhost:5000/api/jobs/stats", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const errorData = await res.json();
                return thunkAPI.rejectWithValue(errorData.message);
            }

            const data = await res.json();
            return data.stats; // contains totalJobs, successJobs, failedJobs, taskUsage
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



// ✅ Delete user (admin only)
// ✅ delete user thunk
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async ({ id, token }, thunkAPI) => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                return thunkAPI.rejectWithValue(errorData.message);
            }

            return id; // return the deleted user id
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const initialState = {
    users: [],
    jobStats: null,
    loading: false,
    error: null,
};




const adminsSlice = createSlice({
    name: "admin",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ✅ Handle user deletion actions
        builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ✅ Handle job stats actions
        builder
            .addCase(fetchJobStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJobStats.fulfilled, (state, action) => {
                state.jobStats = action.payload;
                state.loading = false;
            })
            .addCase(fetchJobStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default adminsSlice.reducer;
