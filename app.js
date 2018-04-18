import config from "./config/config";
import { User } from "./models/User";
import { Product } from "./models/Product";

(() => {
    console.log(config.name);

    let user = new User();
    let product = new Product();
})();