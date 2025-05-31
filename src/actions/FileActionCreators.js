import dispatcher from "../dispatcher";
import {ActionTypes} from "../constants";

const FileActionCreators = {
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


export default FileActionCreators;
