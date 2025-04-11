"use client";
import React from "react";
import News from "./News";
import { Provider } from "react-redux";
import store from "../store";
export default function NewsWrapper() {
  return (
    <Provider store={store}>
      <News />
    </Provider>
  );
}
