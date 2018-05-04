import * as path from "path";
import config from "./config";
import { User, Product } from "./models";
import { DirWatcher } from "./dirwatcher";
import { Importer } from "./importer";

const DATA_DIR = path.join(__dirname, "data");

(() => {
    let user = new User();
    let product = new Product();

    let importer = new Importer();
    let dirWatcher = new DirWatcher();
    
    dirWatcher.watch(DATA_DIR, 3000);
    importer
        .import(DATA_DIR + "/products-data.csv")
        .then(data => console.log("Data: ", data))
        .catch(error => console.error("Error: ", error));

})();
