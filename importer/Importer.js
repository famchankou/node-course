// import * as CSV from "csvtojson";
const CSV = require("csvtojson");
import { readFile } from "fs";
import { emitter } from "../dirwatcher";

// Listen to DirWatcher events and start importing CSV files (convert CSV to JSON) on 'dirwatcher:changed' event
export class Importer {

    import(path = null) {
        return new Promise((resolve, reject) => {
            emitter.on("changed", value => {
                readFile(`${path}\\products-data.csv`, { encoding: 'utf8' }, (error, csvString) => {
                    if (!error) {
                        console.log("Raw CSV: ", csvString);
                        CSV({noheader: true})
                            .fromString(csvString)
                            .on("json", json => {
                                resolve(json);
                            });
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
