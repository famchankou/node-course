import { EventEmitter } from "events";
import { promisify } from "util";
import * as Path from "path";
import { readFile, readdir, stat, statSync, Stats } from "fs";

export class DirWatcher extends EventEmitter {

    constructor(path = null) {
        super();
        this.initState(path).initAsync();
    }

    /**
     * Watches the specified directory for changes and emits an event once the changes occur
     * @param {string} path 
     * @param {number} delay 
     */
    watch(path = null, delay = 100) {
        this.cache.path = path;
        this.setWatcherInterval(delay, _ => this.checkDir(path, _ =>
            super.emit(`dirwatcher:changed`, this.cache.updatedFiles)));
        
        return this;
    }

    /**
     * Checks for the changes in the specified directory
     * @param {string} path 
     * @param {Function} onChange 
     */
    checkDir(path = null, onChange = _ => void 0) {
        this.readDirAsync(path).then(files => {
            let _files = files.filter(filename => DirWatcher._isCSV(filename));
            if (this.cache.isFirstCheck) {
                this.cache.isFirstCheck = false;
                this.updateCacheData(_files, _ => onChange());
            } else {
                if (this.hasChangedFiles(_files)) {
                    this.updateCacheData(_files, _ => onChange());
                } else if(this.hasChangedContent(_files)) {
                    this.updateCacheData(_files, _ => onChange());
                }
            }
        });

        return this;
    }

    /**
     * Updates the stored data
     * Executes a callback function on data update
     * @param {Array<string>} filenames 
     * @param {Function} onComplete 
     */
    updateCacheData(files = [], onComplete = _ => void 0) {
        this.cache.files = files;
        this.cache.statData = {};
        this.cache.files
            .forEach(filename => {
                let fileStat = statSync(Path.join(this.cache.path, filename));
                this.cache.statData[filename] = fileStat;
            });

        onComplete();
        this.cache.updatedFiles = [];

        return this;
    }

    /**
     * Compares files Stats object for content changes
     * Returns true if any file content has been changed and false otherwise
     * @param {Array<string>} files
     */
    hasChangedContent(files = []) {
        let filesWithChangedContent = [];

        files.forEach(filename => {
            let fileStat = statSync(Path.join(this.cache.path, filename));
            if (this.cache.statData[filename].ctimeMs !== fileStat.ctimeMs) {
                filesWithChangedContent.push(filename);
            }
        });

        this.cache.updatedFiles = filesWithChangedContent;

        return filesWithChangedContent.length > 0 ? true : false;
    }

    /**
     * Verfifies if file(s) has(have) been created or removed in specified directory
     * Returns true if any mutations spotted and false otherwise
     * @param {Array<string>} filenames 
     */
    hasChangedFiles(filenames = []) {
        let changes = filenames.filter(file => this.cache.files.indexOf(file) < 0);
        this.cache.updatedFiles = changes;

        return changes.length > 0 ? true : false;
    }

    /**
     * Sets up an interval for watcher
     * @param {number} delay 
     * @param {Function} callback 
     */
    setWatcherInterval(delay = 100, callback) {
        this.cache.interval = setInterval(_ => callback(), delay);

        return this;
    }

    /**
     * Clears the settled timeout
     * Returns true if timeout flushed and false otherwise
     */
    clearWatcherInterval() {
        if (this.cache.interval) {
            clearInterval(this.cache.interval);
            return true;
        }
        return false;
    }

    /**
     * Initialize instance state
     * @param {string} path 
     */
    initState(path = null) {
        this.cache = {
            files: [],
            updatedFiles: [],
            statData: {},
            isFirstCheck: true,
            interval: null,
            path: path
        };

        return this;
    }

    /**
     * Initialize promises from FS streams
     */
    initAsync() {
        this.pReadFile = promisify(readFile);
        this.pReadDir = promisify(readdir);
        this.pStat = promisify(stat);

        return this;
    }

    /**
     * Read directory data for the specified path
     * @param {string} path 
     */
    async readDirAsync(path = null) {
        return await this.pReadDir(path);
    }

    /**
     * Verifies if a given file of CSV format
     * Returns true if CSV and false otherwise
     * @param {string} filename 
     */
    static _isCSV(filename) {
        let csvRegex = RegExp(".+(\.csv)$");
        return csvRegex.test(filename);
    }

}
