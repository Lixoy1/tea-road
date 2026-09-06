import { createRoot } from "react-dom/client";

// v1.0 bootstrap: main-v10.jsx uses createRoot as a shared global.
globalThis.createRoot = createRoot;
