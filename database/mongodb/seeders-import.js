import User from "./models/user";
import Product from "./models/product";
import City from "./models/city";

const USERS = require("./user-fixtures.json");
const PRODUCTS = require("./product-fixtures.json");
const CITIES = require("./city-fixtures.json");

export class SeedersImport {
    static importUsers(callback = _ => {}) {
        User.find({}, (err, users) => {
            if (err) throw err;
            if (users.length === 0) {
                User.insertMany(USERS, (error, docs) => {
                    if (error) {
                        console.log(`An error has been thrown while performing batch insert for Users: [${error}]`);
                        callback();
                    } else {
                        callback(docs);
                    }
                });
            }
        });
    }

    static importProducts(callback = _ => {}) {
        Product.find({}, (err, products) => {
            if (err) throw err;
            if (products.length === 0) {
                Product.insertMany(PRODUCTS, (error, docs) => {
                    if (error) {
                        console.log(`An error has been thrown while performing batch insert Products: [${error}]`);
                    } else {
                        callback(docs);
                    }
                });
            }
        });
    }

    static importCities(callback = _ => {}) {
        City.find({}, (err, cities) => {
            if (err) throw err;
            if (cities.length === 0) {
                City.insertMany(CITIES, (error, docs) => {
                    if (error) {
                        console.log(`An error has been thrown while performing batch insert: [${error}]`);
                    } else {
                        callback(docs);
                    }
                });
            }
        });
    }
}
