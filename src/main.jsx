import { createRoot } from "react-dom/client";
import "../src/styles/reset.css";
import App from "./App.jsx";
import { RecoilRoot } from "recoil";

createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
