import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice"; // adjust path as needed
import adminReducer from '../redux/admin/adminSlice'


const store = configureStore({
    reducer: {
        user: userReducer,
        admin: adminReducer,

    },
});

export default store;