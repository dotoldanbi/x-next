import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./newsStore";
const store = configureStore({
  reducer: {
    news: newsReducer,
  },
});

export default store;
