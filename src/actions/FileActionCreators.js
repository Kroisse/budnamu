var dispatcher = require("../dispatcher");
var {ActionTypes} = require("../constants");

var FileActionCreators = {
    loadRemoteFile(path) {
        var request =  new XMLHttpRequest();
        request.onload = function () {
            FileActionCreators.loadString(request.responseText);
        };
        request.open('GET', path, true);
        request.overrideMimeType('text/plain');
        request.send();
    },
    loadString(content) {
        dispatcher.handleServerAction({
            type: ActionTypes.LOAD_STRING,
            content: content
        });
    }
};


module.exports = FileActionCreators;
