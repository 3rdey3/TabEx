import React from "react";
import ReactDOM from "react-dom/client";
import { TabExApp } from "./components/TabExApp";
import { PopupProvider } from "./PopupStore";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <PopupProvider>
      <TabExApp></TabExApp>
    </PopupProvider>
  </React.StrictMode>
);