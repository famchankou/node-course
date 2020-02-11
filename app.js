import * as Path from "path";
import * as BodyParser from "body-parser";
import { createLogger, format, transports } from "winston";
import Express from "express";
import Passport from "passport";
import Mongoose from "mongoose";
import cors from "cors";
import { Worker, MessageChannel } from 'worker_threads';
import WorkerPool from './workers/WorkerPool';

import {
    IndexRouter, ErrorRouter, UserRouter, ProductRouter,
    ReviewRouter, AuthRouter, CityRouter
} from "./routes";
import { QueryParserMiddleware, CookieParserMiddleware } from "./middlewares";
import { Importer, DirWatcher } from "./modules";
import { UserController } from "./controllers";

try {
    Mongoose.connect("mongodb://localhost:27017/node-course");
    console.log(`MongoDB connected on port: 27017`);
} catch (error) {
    console.log(`MongoDB connection Error: ${error}`);
}

// Worker Pool
// const worker = new Worker(Path.join(__dirname, 'workers', 'worker.js'));
// const { port1, port2 } = new MessageChannel();
// port1.on('message', (message) => {
//     console.log('message from worker:', message);
// });
// worker.postMessage({ port: port2 }, [port2]);

const pool = new WorkerPool(Path.join(__dirname, 'workers', 'Worker.js'), 8);

// const items = [...new Array(100)].fill(null);
// Promise.all(
//     items.map(async (_, i) => {
//         await pool.run(() => ({ i }));
//         console.log('Worker Task Finished', i);
//     }),
// ).then(() => {
//     console.log('All Workers Tasks Finished');
// });


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
