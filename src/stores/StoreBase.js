import {EventEmitter} from "events";
import {Events} from "../constants";
import dispatcher from "../dispatcher";


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

export default StoreBase;
