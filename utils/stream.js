const Repl = require("repl");
const Colors = require("colors");
const Minimist = require("minimist");
const Winston = require("winston");

class Utils {
    static unknownHandler(arg) {
        if (arg !== "help" && arg !== "h") {
            console.log("unknown option", arg);
            return false;
        }
    }
}

class CommandsParser {
    constructor(args) {
        console.log(args);
    }
}

const commands = ["action", "file", "path", "help"];
const aliasObject = {
    "action": "a",
    "file": "f",
    "path": "p",
    "help": "h"
};

const parser = new CommandsParser(
    Minimist(process.argv.slice(2), {
        alias: aliasObject,
        unknown: Utils.unknownHandler,
        string: commands
    }
));


// ./streams.js --action=outputFile --file=users.csv 
// ./streams.js --action=transformToFile --file=users.csv
// ./streams.js --action=transform textToTransform
// ./streams.js -a outputFile -f users.csv
// ./streams.js --help
// ./streams.js -h
// ./streams.js --action=cssBundler --path=./assets/css
// ./streams.js --action=cssBundler -p ./assets/css




// const replServer = Repl.start({
//     prompt: "REPL::".red,
//     useColors: true,
//     ignoreUndefined: true
// });
// replServer.context.fs = require("fs");

// const logger = Winston.createLogger({
//     level: 'info',
//     format: Winston.format.json(),
//     transports: [
//         //
//         // - Write to all logs with level `info` and below to `combined.log` 
//         // - Write all logs error (and below) to `error.log`.
//         //
//         new Winston.transports.File({ filename: 'error.log', level: 'error' }),
//         new Winston.transports.File({ filename: 'combined.log' })
//     ]
// });

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new Winston.transports.Console({
//         format: Winston.format.simple()
//     }));
// }

//////////////////////////////////////////////////////////
////////////////////// Actions ///////////////////////////
//////////////////////////////////////////////////////////

function reverse (str) {
    console.log("reverse", str);
};

function transform (str) {
    console.log("transform", str);
};

function outputFile (filePath) {
    console.log("outputFile", filePath);
};

function convertFromFile (filePath) {
    console.log("convertFromFile", filePath);
};

function convertToFile (filePath) {
    console.log("convertToFile", filePath);
};

function cssBundler(path) {
    console.log("cssBundler", path);
}
