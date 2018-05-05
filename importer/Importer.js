import CSV from "csvtojson";
import * as Path from "path";
import { readFile, readdir, readFileSync, readdirSync } from "fs";
import { emitter } from "../dirwatcher";

const converterOptions = {
	noheader: true,
	trim: true,
};

export class Importer {

    /**
     * Returns a Promise with imported data from CSV files for a given path
     * @param {string} path 
     */
    import(path = null) {
        return new Promise((resolve, reject) => {
            emitter.on("dirwatcher:changed", value => {
                this._readFiles(path)
                    .then(data => {
                        let promises = [];
                        data.forEach(dataChunk => {
                            promises.push(new Promise((resolve, reject) => {
                                this._convertCSVtoJS(Object.values(dataChunk)[0], (error, data) => {
                                    if (!error) {
                                        resolve({[Object.keys(dataChunk)[0]]: data});
                                    } else {
                                        reject(error);
                                    }
                                })
                            }));
                        });

                        resolve(Promise.all(promises));
                    })
                    .catch(error => reject(error));
            });
        });
    }

    /**
     * Synchronously returns imported data from CSV files for a given path
     * @param {string} path 
     */
    importSync(path = null) {
        
        
    }

    /**
     * Reads all files from specified directory asynchronously
     * Returns Promise<Array<{filename: data}>>
     * @param {string} dirname 
     */
    _readFiles(dirname) {
        return new Promise((resolve, reject) => {
            readdir(dirname, (error, filenames) => {
                let promises = [], csvRegex = RegExp(".+(\.csv)$");
                if (error) reject(error);

                filenames
                    .filter(file => csvRegex.test(file))
                    .forEach(filename => {
                        promises.push(new Promise((resolve, reject) => {
                            readFile(Path.join(dirname, filename), { encoding: "utf8" }, (error, data) => {
                                if (error) reject(error);
                                resolve({[filename]: data});
                            });
                        }));
                    });

                resolve(Promise.all(promises));
            });
        });
    }

    /**
     * Reads all files from specified directory synchronously
     * Returns Array<{filename: data}>
     * @param {string} dirname 
     */
    _readFilesSync(dirname) {
        let filenames = readdirSync(dirname);
        return filenames.map(filename => {[filename]: readFileSync(Path.join(dirname, filename), { encoding: "utf8" })});
    }

    /**
     * Converts CSV Data String to Objects
     * Returns an Array of JS Objects converted from CSV Data String
     * @param {string} csvString 
     * @param {Function} handler 
     */
    _convertCSVtoJS(csvString, handler = (error, result) => void 0) {
        let pusher, result = [];

        CSV(converterOptions)
            .fromString(csvString)
            .on("json", (data, row) => {
                if (row === 0) {
                    pusher = this._mapData(data);
                } else {
                    pusher(result, data);
                }
            })
            .on("end", _ => handler(null, result))
            .on("error", error => handler(error, result));
    }

    /**
     * Maps the CSV Title properties into object keys for Data rows
     * Returnes remapped Object
     * @param {Object} header 
     */
    _mapData(header) {
        return (result, data) => {
            result.push(Object.keys(data).reduce((object, key) => {
                object[header[key].replace(" ", "")] = data[key];
                return object;
            }, new Object()));
        };
    }

}
