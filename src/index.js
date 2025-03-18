import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import rootReducer from './reducer';
import { configureStore } from "@reduxjs/toolkit";
import { Toaster } from 'react-hot-toast';
import "./index.css";
const store = configureStore({
  reducer: rootReducer,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <Navbar/> */}
      <App />
      <Toaster />
    </Provider>
  </React.StrictMode>
);

