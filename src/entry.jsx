"use strict";
import "./style.less";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "jotai";
import SyntaxTree from "./views/SyntaxTree.jsx";
import Immutable from "immutable";

window.Immutable = Immutable; // DEBUG

console.log("entry.js loaded");

// React 18+ doesn't need to wait for DOMContentLoaded
const rootElement = document.getElementById('root');
console.log("Root element:", rootElement);

try {
    const root = createRoot(rootElement);
    root.render(
        <Provider>
            <SyntaxTree />
        </Provider>
    );
    console.log("React app rendered with Jotai");
} catch (error) {
    console.error("Error during initialization:", error);
}