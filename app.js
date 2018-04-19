import config from "./config";
import { User, Product } from "./models";

(() => {
    console.log(config.name);

    let user = new User();
    let product = new Product();
})();