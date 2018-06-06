import * as Path from "path";
import CookieParser from "cookie-parser";
import * as BodyParser from "body-parser";
import { createLogger, format, transports } from "winston";
import Express from "express";

import config from "./config";
import { User, Product } from "./models";
import { QueryParserMiddleware } from "./middlewares";
import { Importer, DirWatcher } from "./modules";
import { UserRouter, ProductRouter } from "./routes";

const app = Express();
const DATA_DIR = Path.join(__dirname, "data");
const { combine, timestamp, label, printf } = format;

const formatLog = printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);
const logger = createLogger({
    format: combine(
        label({ label: "App.js" }),
        timestamp(),
        formatLog
    ),
    transports: [new transports.Console()]
});

// Middlewares
app.use(BodyParser.json());
app.use(QueryParserMiddleware.parseQueryParams);
app.use(BodyParser.urlencoded({ extended: true }));
app.use(CookieParser());

// Routes
app.use(UserRouter);
app.use(ProductRouter);

app.use((req, res, next) => {
    let err = new Error("Page Not Found");
    logger.error(err);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

let user = new User();
let product = new Product();

let importer = new Importer();
let dirWatcher = new DirWatcher();

// dirWatcher.watch(DATA_DIR, 3000);
// dirWatcher.on("dirwatcher:changed", updatedFiles => {
//     importer
//         .import(DATA_DIR, updatedFiles)
//         .then(data => console.log("Data: ", JSON.stringify(data)))
//         .catch(error => console.error("Error: ", error));
// });

module.exports = app;
