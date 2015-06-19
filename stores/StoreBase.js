var {EventEmitter} = require("events");
var {Events} = require("../constants");
var dispatcher = require("dispatcher");


class StoreBase extends EventEmitter {
    constructor() {
        super();
        if (this.performAction) {
            this.dispatchToken = dispatcher.register(this.performAction.bind(this));
        }
    }
    
    emitChange() {
        this.emit(Events.CHANGE);
    }

    /**
     * @param {function} callback
     */
    addChangeListener(callback) {
        this.on(Events.CHANGE, callback);
    }

    /**
     * @param {function} callback
     */
    removeChangeListener(callback) {
        this.removeListener(Events.CHANGE, callback);
    }
}

module.exports = StoreBase;
