"use strict";
require("babel/polyfill");
require("style.less");
var React = require("react");
var FileActionCreators = require("./actions/FileActionCreators");
var SyntaxTree = React.createFactory(require("./views/SyntaxTree"));

window.Immutable = require("immutable"); // DEBUG

document.addEventListener("DOMContentLoaded", function (event) {
    FileActionCreators.loadRemoteFile("./dispatcher.js");
    React.render(SyntaxTree(), document.body);
});
