import { createRoot } from "react-dom/client";
import React from "react";
import "./global.css";
import { App } from "./app";

const root = document.body.querySelector("#root");
if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
