var mirrorkey = require("mirrorkey");

module.exports = {
    Events: mirrorkey(["CHANGE"], "lower-case"),

    ActionTypes: mirrorkey([
        "LOAD_STRING"
    ]),

    PayloadSources: mirrorkey([
        "SERVER_ACTION",
        "VIEW_ACTION"
    ])
};
