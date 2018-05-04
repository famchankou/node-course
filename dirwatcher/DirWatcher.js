import { EventEmitter } from "events";
import { readdir } from "fs";

class Emitter extends EventEmitter {}
const emitter = new Emitter();

class DirWatcher {

    watch(path = null, delay = 100) {
        // Emit 'changed' event if dir content changed
        // When the path is cheked for the first time all files treated as new

        setTimeout(() => {
            emitter.emit("changed", "changed...");
        }, delay);
    }

}

module.exports = { DirWatcher, emitter }
