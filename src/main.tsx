import { createRoot } from "react-dom/client";
import { App } from "./app";
import React from "react";

const root = document.body.querySelector("#root");
if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
);
