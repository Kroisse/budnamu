var {ActionTypes} = require("../constants");
var StoreBase = require("./StoreBase");
var acorn = require("acorn");
var Immutable = require("immutable");


function _toImmutable(json) {
    if (Array.isArray(json)) {
        return Immutable.Seq(json).map(_toImmutable).toList();
    }
    if (json && (json instanceof acorn.Node || json.constructor === Object)) {
        return Immutable.Seq(json).map(_toImmutable).toMap();
    }
    return json;
}


class SyntaxTreeStore extends StoreBase {
    constructor() {
        super();
        this._setSyntaxTree({type: "Program", body: []});
    }

    parseString(content) {
        var tree = acorn.parse(content, {
            ecmaVersion: 6
        });
        this._setSyntaxTree(tree);
    }

    getSyntaxTree() {
        return this._syntaxTree;
    }

    _setSyntaxTree(tree) {
        this._syntaxTree = _toImmutable(tree);
    }

    performAction(payload) {
        var action = payload.action;
        switch(action.type) {
            case ActionTypes.LOAD_STRING:
                this.parseString(action.content);
                this.emitChange();
                break;
            default:
                // do nothing
        }
    }
}

module.exports = new SyntaxTreeStore();
