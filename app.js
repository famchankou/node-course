import * as path from "path";
import config from "./config";
import { User, Product } from "./models";
import { DirWatcher } from "./dirwatcher";
import { Importer } from "./importer";

const DATA_DIR = path.join(__dirname, "data");

(() => {
    console.log(config.name);

    let user = new User();
    let product = new Product();

    let importer = new Importer();
    let dirWatcher = new DirWatcher();
    dirWatcher.watch(DATA_DIR, 3000);
    importer
        .import(DATA_DIR)
        .then(data => console.log("JSON Data: ", data))
        .catch(error => console.error(error));

})();