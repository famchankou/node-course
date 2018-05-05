import { EventEmitter } from "events";
import { readdir } from "fs";

class DirWatcherEmitter extends EventEmitter {
    emit(event, value) {
        super.emit(`dirwatcher:${event}`, value);
    }
}
const emitter = new DirWatcherEmitter();

class DirWatcher {

    /**
     * Watches the specified directory for changes and emits an event once the changes occur
     * @param {string} path 
     * @param {number} delay 
     */
    watch(path = null, delay = 100) {
        // Emit 'changed' event if dir content changed
        // When the path is cheked for the first time all files treated as new

        let interval = setInterval(_ => {
            emitter.emit("changed", "changed...");
        }, delay);
        
        // clearInterval(interval);
    }

}

module.exports = { DirWatcher, emitter }
