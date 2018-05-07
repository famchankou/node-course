import { EventEmitter } from "events";
import { Importer } from "../importer";
import * as Path from "path";
import { readFile, readFileSync, readdir } from "fs";

class DirWatcherEmitter extends EventEmitter {
    emit(event, value) {
        super.emit(`dirwatcher:${event}`, value);
    }
}
const emitter = new DirWatcherEmitter();

class DirWatcher {

    constructor(path = null) {
        this.cache = {
            fileNames: [],
            bufferData: {},
            isFirstCheck: true
        };
        this.changes = null;
        this.interval = null;
        this.path = path;
    }

    /**
     * Watches the specified directory for changes and emits an event once the changes occur
     * @param {string} path 
     * @param {number} delay 
     */
    watch(path = null, delay = 100) {
        this.path = path;
        this.setWatcherInterval(delay, _ => {
            this.watchDir(path)
                .then(descriptor => {
                    switch(descriptor.event) {
                        case "init":
                            emitter.emit("changed", descriptor.changes);
                            break;
                        case "fileschange":
                            emitter.emit("changed", descriptor.changes);
                            break;
                        case "contentchange":
                            emitter.emit("changed", descriptor.changes);
                            break;
                        case "nochange":
                            break;
                        default:
                            throw new Error("Invalid event type!");
                    };
                })
                .catch(error => console.error(error));
        });
    }

    /**
     * Watches for the changes of the specified directory
     * Returns a Promise with an Object of the event type and mutated filename(s)
     * @param {string} path 
     */
    watchDir(path = null) {
        return new Promise((resolve, reject) => {
            readdir(path, (error, filenames) => {
                let _filenames = filenames.filter(filename => Importer._isCSV(filename));
                if (error) reject(error);
                
                if (this.cache.isFirstCheck) {
                    this.cache.isFirstCheck = false;

                    this.updateCacheData(_filenames, _ => {
                        resolve({event: "init", changes: this.changes = null});
                    });
                } else {
                    if (this.hasChangedFiles(_filenames)) {
                        this.updateCacheData(_filenames, _ => {
                            resolve({event: "fileschange", changes: this.changes});
                        });
                    } else if(this.hasChangedContent(_filenames)) {
                        this.updateCacheData(_filenames, _ => {
                            resolve({event: "contentchange", changes: this.changes});
                        });
                    } else {
                        resolve({event: "nochange", changes: this.changes = null});
                    }
                }
            });
        });
    }

    /**
     * Updates the stored data
     * Executes a callback function on data update
     * @param {Array<string>} filenames 
     * @param {Function} onComplete 
     */
    updateCacheData(filenames = [], onComplete = _ => void 0) {
        this.cache.fileNames = filenames;
        this.cache.bufferData = {};

        this.cache.fileNames
            .forEach(filename => {
                let fileBuffer = readFileSync(Path.join(this.path, filename));
                this.cache.bufferData[filename] = fileBuffer;
            });

        onComplete();
    }

    /**
     * Verfifies if file(s) has(have) been created or removed in specified directory
     * Returns true if any mutations spotted and false otherwise
     * @param {Array<string>} filenames 
     */
    hasChangedFiles(filenames = []) {
        let changes = this.cache.fileNames
            .filter(file => filenames.indexOf(file) < 0)
            .concat(filenames.filter(file => this.cache.fileNames.indexOf(file) < 0));

        if (changes.length > 0) {
            this.changes = changes;
        }

        return changes.length > 0 ? true : false;
    }

    /**
     * Compares files buffers for content changes
     * Returns true if file content has been changed and false otherwise
     * @param {Array<string>} filenames 
     */
    hasChangedContent(filenames = []) {
        let isContentChanged = false;

        try {
            filenames.forEach(filename => {
                let fileBuffer = readFileSync(Path.join(this.path, filename));
                if (!this.cache.bufferData[filename].equals(fileBuffer)) {
                    this.changes = {[filename]: fileBuffer.toString('utf8')};
                    throw true;
                }
            });
            isContentChanged = false;
        } catch (error) {
            isContentChanged = error;
        }

        return isContentChanged;
    }

    /**
     * Sets up an interval for watcher
     * @param {number} delay 
     * @param {Function} callback 
     */
    setWatcherInterval(delay = 100, callback) {
        this.interval = setInterval(_ => callback(), delay);
    }

    /**
     * Clears the settled timeout
     * Returns true if timeout flushed and false otherwise
     */
    clearWatcherInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            return true;
        }
        return false;
    }

}

module.exports = { DirWatcher, emitter }
