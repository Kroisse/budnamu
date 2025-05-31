"use strict";
import "./style.less";
import React from "react";
import { createRoot } from "react-dom/client";
import FileActionCreators from "./actions/FileActionCreators";
import SyntaxTree from "./views/SyntaxTree.jsx";
import Immutable from "immutable";

window.Immutable = Immutable; // DEBUG

console.log("entry.js loaded");

// React 18+ doesn't need to wait for DOMContentLoaded
const rootElement = document.getElementById('root');
console.log("Root element:", rootElement);

try {
    FileActionCreators.loadRemoteFile("/src/dispatcher.js");
    console.log("FileActionCreators.loadRemoteFile called");

    const root = createRoot(rootElement);
    root.render(<SyntaxTree />);
    console.log("React app rendered");
} catch (error) {
    console.error("Error during initialization:", error);
}
