import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// Set up auth token getter for API client
setAuthTokenGetter(() => localStorage.getItem("hwv_token"));
setBaseUrl(import.meta.env.VITE_API_BASE_URL ?? null);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
