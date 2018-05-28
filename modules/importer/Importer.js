import CSV from "csvtojson";
import * as CSVSync from "csvjson";
import * as Path from "path";
import { readFile, readdir, readFileSync, readdirSync } from "fs";

const converterOptions = {
	noheader: true,
	trim: true,
};

export class Importer {

    /**
     * Returns a Promise with imported data from CSV files for a given path
     * If files Array provided, it will import only provided files for a given path
     * @param {string} path 
     * @param {Array<string>} files 
     */
    import(path = null, files = []) {
        return new Promise((resolve, reject) => {
            if (0 < files.length) {
                let promises = [];
                files.forEach(file => {
                    promises.push(new Promise((resolve, reject) => {
                        readFile(Path.join(path, file), { encoding: "utf8" }, (error, data) => {
                            if (error) reject(error);
                            Importer._convertCSVtoJS(data, (error, jsData) => {
                                if (!error) {
                                    resolve({[file]: jsData});
                                } else {
                                    reject(error);
                                }
                            })
                        });
                    }));
                });

                resolve(Promise.all(promises));
            } else {
                Importer
                    ._readFiles(path)
                    .then(data => {
                        let promises = [];

                        data.forEach(dataChunk => {
                            promises.push(new Promise((resolve, reject) => {
                                Importer._convertCSVtoJS(Object.values(dataChunk)[0], (error, data) => {
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
            }
        });
    }

    /**
     * Synchronously returns imported data from CSV files for a given path
     * If files Array provided, it will import only provided files for a given path
     * @param {string} path 
     * @param {Array<string>} files 
     */
    importSync(path = null, files = []) {
        let filesData = new Object();

        if (0 < files.length) {
            filesData = files.map(file => {
                return {
                    [filename]: readFileSync(Path.join(path, filename), { encoding: "utf8" })
                }
            });
        } else {
            filesData = Importer._readFilesSync(path).map(data => {
                return {[Object.keys(data)[0]]: Importer._convertCSVtoJSSync(Object.values(data)[0])};
            });
        }

        return filesData;
    }

    /**
     * Reads all files from specified directory asynchronously
     * Returns Promise<Array<{filename: data}>>
     * @param {string} dirname 
     */
    static _readFiles(dirname = null) {
        return new Promise((resolve, reject) => {
            readdir(dirname, (error, filenames) => {
                let promises = [];
                if (error) reject(error);

                filenames
                    .filter(filename => Importer._isCSV(filename))
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
    static _readFilesSync(dirname = null) {
        try {
            let filenames = readdirSync(dirname);
            return filenames
                .filter(filename => Importer._isCSV(filename))
                .map(filename => {
                    return {
                        [filename]: readFileSync(Path.join(dirname, filename), { encoding: "utf8" })
                    }
                });
        } catch (error) {
            return error;
        }
    }

    /**
     * Converts CSV data to JS Object synchronously
     * @param {Object} data 
     */
    static _convertCSVtoJSSync(data = null) {
        let convertedJS = new Object();
        if (data) convertedJS = CSVSync.toObject(data);

        return convertedJS;
    }

    /**
     * Converts CSV Data String to Objects
     * Returns an Array of JS Objects converted from CSV Data String
     * @param {string} csvString 
     * @param {Function} handler 
     */
    static _convertCSVtoJS(csvString = "", handler = (error, result) => void 0) {
        let pusher, result = [];

        CSV(converterOptions)
            .fromString(csvString)
            .on("json", (data, row) => {
                if (row === 0) {
                    pusher = Importer._mapData(data);
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
    static _mapData(header) {
        return (result, data) => {
            try {
                result.push(Object.keys(data).reduce((object, key) => {
                    object[header[key].replace(" ", "")] = data[key];
                    return object;
                }, new Object()));
            } catch (e) {
                console.error(`An error has been thrown while mapping the file header for ${JSON.stringify(data)}: [${e.message}]`);
            }
        };
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
