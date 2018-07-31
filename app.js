import * as Path from "path";
import * as BodyParser from "body-parser";
import { createLogger, format, transports } from "winston";
import Express from "express";
import Passport from "passport";
import Mongoose from "mongoose";
import cors from "cors";

import { IndexRouter, ErrorRouter, UserRouter, ProductRouter,
    ReviewRouter, AuthRouter, CityRouter } from "./routes";
import { QueryParserMiddleware, CookieParserMiddleware } from "./middlewares";
import { Importer, DirWatcher } from "./modules";
import { UserController } from "./controllers";

try {
    Mongoose.connect("mongodb://localhost:27017/node-course");
} catch (error) {
    console.log(`MongoDB connection Error: ${error}`);
}

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
app.use(BodyParser.urlencoded({ extended: true }));
app.use(QueryParserMiddleware.parseQueryParams);
app.use(CookieParserMiddleware.parseCookie);
app.use(Passport.initialize());
app.use(cors());

// Routes
app.use(IndexRouter);
app.use(ErrorRouter);
app.use(AuthRouter);
app.use(UserRouter);
app.use(ProductRouter);
app.use(ReviewRouter);
app.use(CityRouter);

app.use((req, res, next) => {
    let err = new Error(`Page Not Found - ${JSON.stringify(req.parsedQuery.href)}`);
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

module.exports = app;
