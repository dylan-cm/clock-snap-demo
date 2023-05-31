import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { Workbox } from "workbox-window";
import reportWebVitals from "./reportWebVitals";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./firebase";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  const wb = new Workbox(`${process.env.PUBLIC_URL}/service-worker.js`);

  wb.addEventListener("installed", (event) => {
    if (event.isUpdate) {
      window.location.reload();
    }
  });

  wb.register();
} else {
  serviceWorkerRegistration.unregister();
}

reportWebVitals();
