import * as Path from "path";
import config from "./config";
import { User, Product } from "./models";
import { Importer, DirWatcher } from "./modules";
import Express from "express";

const app = Express();
const DATA_DIR = Path.join(__dirname, "data");

app.get('/', (req, res) => res.send('Hello World!'))

let user = new User();
let product = new Product();

let importer = new Importer();
let dirWatcher = new DirWatcher();

dirWatcher.watch(DATA_DIR, 3000);
dirWatcher.on("dirwatcher:changed", updatedFiles => {
    importer
        .import(DATA_DIR, updatedFiles)
        .then(data => console.log("Data: ", JSON.stringify(data)))
        .catch(error => console.error("Error: ", error));
});

module.exports = app;
