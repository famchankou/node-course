import CSV from "csvtojson";
import { readFile } from "fs";
import { emitter } from "../dirwatcher";

const converterOptions = {
	noheader: true,
	trim: true,
};

const mapData = header => (result, data) => {
    result.push(Object.keys(data).reduce((object, key) => {
        object[header[key].replace(" ", "")] = data[key];
        return object;
    }, new Object()));
};

// Listen to DirWatcher events and start importing CSV files (convert CSV to JSON) on 'dirwatcher:changed' event
export class Importer {

    import(path = null) {
        return new Promise((resolve, reject) => {
            emitter.on("changed", value => {
                readFile(path, { encoding: 'utf8' }, (error, csvString) => {
                    if (!error) {
                        let pusher, result = [];

                        CSV(converterOptions)
                            .fromString(csvString)
                            .on("json", (data, row) => {
                                if (row === 0) {
                                    pusher = mapData(data);
                                } else {
                                    pusher(result, data);
                                }
                            })
                            .on("error", error => {
                                reject(error);
                            });

                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
            });
        });
        // Return a Promise with imported data from file path
    }

    importSync(path = null) {
        
        // Synchronously return all imported data from file path
    }

}
