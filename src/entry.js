"use strict";
import "./style.less";
import React from "react";
import FileActionCreators from "./actions/FileActionCreators";
import SyntaxTreeComponent from "./views/SyntaxTree.jsx";
import Immutable from "immutable";

const SyntaxTree = React.createFactory(SyntaxTreeComponent);

window.Immutable = Immutable; // DEBUG

document.addEventListener("DOMContentLoaded", function (event) {
    FileActionCreators.loadRemoteFile("./dispatcher.js");
    React.render(SyntaxTree(), document.body);
});
