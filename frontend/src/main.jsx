import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="379685038550-ke9d9mj6a8oj0k1c4evshmp2uh826itu.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
