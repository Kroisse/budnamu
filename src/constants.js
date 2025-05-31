import mirrorkey from "mirrorkey";

export const Events = mirrorkey(["CHANGE"], "lower-case");

export const ActionTypes = mirrorkey([
    "LOAD_STRING"
]);

export const PayloadSources = mirrorkey([
    "SERVER_ACTION",
    "VIEW_ACTION"
]);
