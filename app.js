import * as Path from "path";
import config from "./config";
import { User, Product } from "./models";
import { Importer, DirWatcher } from "./modules";
import { Routes } from "./routes";
import Express from "express";

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const app = Express();
const DATA_DIR = Path.join(__dirname, "data");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(Routes);

app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

if (app.get("env") === "development") {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

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
