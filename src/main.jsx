import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";

import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);