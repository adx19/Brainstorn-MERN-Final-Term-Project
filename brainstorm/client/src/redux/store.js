
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slice/authSlice";
import boardReducer from "./slice/boardSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardReducer,
  },
});

export default store;