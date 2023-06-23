import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { Workbox } from "workbox-window";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/UserContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
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
