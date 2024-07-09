import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./css/style.css";
import "./css/satoshi.css";
import "flatpickr/dist/flatpickr.min.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  </Provider>
);
