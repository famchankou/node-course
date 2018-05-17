import * as Path from "path";
import config from "./config";
import { User, Product } from "./models";
import { Importer, DirWatcher } from "./modules";

const DATA_DIR = Path.join(__dirname, "data");

(() => {
    let user = new User();
    let product = new Product();

    let importer = new Importer();
    let dirWatcher = new DirWatcher();
    
    dirWatcher.watch(DATA_DIR, 3000);
    dirWatcher.on("dirwatcher:changed", value => {
        importer
            .import(DATA_DIR)
            .then(data => console.log("Data: ", JSON.stringify(data)))
            .catch(error => console.error("Error: ", error));
    });
})();
