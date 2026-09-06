import React from "react";
import { createRoot } from "react-dom/client";

// v1.0 bootstrap: main-v10.jsx uses createRoot as a shared global.
globalThis.createRoot = createRoot;

// main-v10.jsx references ChevronRight in several screens.
// Keep the demo resilient while the icon import is consolidated upstream.
globalThis.ChevronRight = function ChevronRight(props) {
  return React.createElement("span", {
    ...props,
    className: `${props.className || ""} v10-chevron`.trim(),
    "aria-hidden": true
  }, "›");
};
