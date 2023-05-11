import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./contexts/ChatProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <ChatProvider>
      <App />
    </ChatProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
