const FS = require("fs");
const Path = require("path");
const Colors = require("colors");
const Minimist = require("minimist");
const Converter = require("csvtojson").Converter;

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const Through = require("through2");
const TRStream = Through(write, end);

const stdin = process.stdin;
const stdout = process.stdout;
const inArguments = process.argv.slice(2);
stdin.setEncoding("utf8");

const DATA_DIR = Path.join(__dirname, "..", "data");

const formatLog = printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);
const logger = createLogger({
    format: combine(
        label({ label: 'Stream.js' }),
        timestamp(),
        formatLog
    ),
    transports: [new transports.Console()]
});

class Utils {
    static get commands() {
        return ["action", "file", "path", "help"];
    }

    static get aliasObject() {
        return {
            "action": "a",
            "file": "f",
            "path": "p",
            "help": "h"
        };
    }

    static isSupportedCommand(command) {
        return Utils.commands.includes(command);
    }

    static isCSS(filename) {
        let cssRegex = RegExp(".+(\.css)$");
        return cssRegex.test(filename);
    }

    static renderHelpNotification(message = null) {
        if (message) logger.error(message);
        logger.info(
        `Supported commands and examples:`.blue + `\n` +
        `\t./streams.js --action=convertFromFile --file=users.csv
        ./streams.js --action=convertToFile --file=users.csv
        ./streams.js --action=outputFile --file=users.csv
        ./streams.js --action=transform 'stringToTransform'
        ./streams.js --action=reverse 'stringToReverse'
        ./streams.js --action=cssBundler --path=./assets/css
        ./streams.js --action=cssBundler -p ./assets/css
        ./streams.js -a outputFile -f users.csv
        ./streams.js --help
        ./streams.js -h
        `.grey);
        logger.info(`Short commands examples:`.blue + `\n` +
        `\t./streams.js -a convertFromFile -file users.csv
        ./streams.js -action convertToFile -file users.csv
        ./streams.js -action outputFile -file users.csv
        ./streams.js -action transform 'stringToTransform'
        ./streams.js -action reverse 'stringToReverse'
        ./streams.js -action cssBundler -path ./assets/css
        ./streams.js -action cssBundler -p ./assets/css`.grey
        );
    }
}

class CommandsParser {
    constructor(commands) {
        this.actions = new Map();
        this.commands = commands;
    }

    registerAction(actionName = null, handlerObject = null) {
        if (actionName && handlerObject) {
            this.actions.set(actionName, handlerObject);
        }

        return this;
    }

    unregisterAction(actionName = null) {
        if (actionName) {
            this.actions.delete(actionName);
        }

        return this;
    }

    execute() {
        let config = {
            actionType: Array.isArray(this.commands.action) ? this.commands.action[0] : this.commands.action,
            filePath: Array.isArray(this.commands.file) ? this.commands.file[0] : this.commands.file,
            path: Array.isArray(this.commands.path) ? this.commands.path[0] : this.commands.path,
            help: Array.isArray(this.commands.help) ? this.commands.help[0] : this.commands.help,
            extra: this.commands._
        }

        if (this.isCommandsLineEmpty()) {
            Utils.renderHelpNotification(`Wrong input! Please, use the commands below:`.red);
            return this;
        }

        if (void 0 !== config.help && this.isHelpFirst()) {
            Utils.renderHelpNotification();
            return this;
        }
        
        if (config.actionType && this.actions.has(config.actionType)) {
            let actionObject = this.actions.get(config.actionType);
            let param = config[actionObject.paramTypes[0]];

            if (param) {
                actionObject.action(param);
            } else {
                actionObject.action(config.extra[0]);
            }
            
        } else {
            Utils.renderHelpNotification(`No such action type: [${config.actionType}]`.red);
        }
    }

    isHelpFirst() {
        let args = inArguments;
        let regexp = /^(-h|-help|--help)/i;
        let parsedChunks = args.join().match(regexp);

        return parsedChunks &&
            (parsedChunks[0] === "-h" || parsedChunks[0] === "--help");
    }

    isCommandsLineEmpty() {
        let args = inArguments;
        return 0 === args.length ? true : false;
    }
}

/**
 * An action to read a string via stdin and output reversed string to stdout
 * @param {string} str 
 */
function reverse (str = null) {
    const reverse = str => str.split``.reverse().join``;
    stdin.resume();

    try {
        if (str && str.length) {
            stdout.write(`Reversed: ${reverse(str)} \n`);
        }

        stdin.on("data", str => {
            stdout.write(`Reversed: ${reverse(str)} \n`);
        });
    } catch (e) {
        Utils.renderHelpNotification(`An error occurred while reading the stream data [${e}]`.red);
    }
};

/**
 * An action to read a string via stdin and output capitalised string to stdout
 * @param {string} str 
 */
function transform (str = null) {
    try {
        if (str && str.length) {
            stdout.write(`${str}\n`.toUpperCase());
        }

        stdin.pipe(TRStream).pipe(stdout);
    } catch (e) {
        Utils.renderHelpNotification(`An error occurred while reading the stream data [${e}]`.red);
    }
};

/**
 * An action to read CSV file data and output to stdout
 * @param {string} filePath 
 */
function outputFile (filePath = null) {
    try {
        let file = Path.join(DATA_DIR, filePath);

        let fd = FS.openSync(file, "r");
        let readStream = FS.createReadStream(null, {fd: fd});
        readStream.pipe(stdout);
    } catch (e) {
        Utils.renderHelpNotification(`An error occurred while reading the file [${e}]`.red);
    }
};

/**
 * An action to read CSV file data, convert to JSON and output to stdout
 * @param {string} filePath 
 */
function convertFromFile (filePath = null) {
    try {
        let file = Path.join(DATA_DIR, filePath);

        let csvConverter = new Converter({constructResult: false, toArrayString: true});
        let readStream = FS.createReadStream(file);
        readStream.pipe(csvConverter).pipe(stdout);
    } catch (e) {
        Utils.renderHelpNotification(`An error occurred while reading the file [${e}]`.red);
    }
};

/**
 * An action to read CSV file data, convert to JSON and write it to the same directory
 * @param {string} filePath 
 */
function convertToFile (filePath = null) {
    try {
        let file = Path.join(DATA_DIR, filePath);
        let filename = file.split("/").pop();
    
        let csvConverter = new Converter({constructResult: false, toArrayString: true});
        let readStream = FS.createReadStream(file); 
        let writeStream = FS.createWriteStream(
            Path.join(DATA_DIR, `${filename.substr(0, filename.lastIndexOf("."))}.json`)
        );
        
        readStream
            .pipe(csvConverter)
            .pipe(writeStream);
    } catch (e) {
        Utils.renderHelpNotification(`An error occurred while reading the file [${e}]`.red);
    }
};

/**
 * An action to collect all CSS files from the specified directory and bundle them into one single file
 * @param {string} path 
 */
function cssBundler (path = null) {
    try {
        let dirname = Path.join(DATA_DIR, path);
        let readStreams = [];
        let targetFileName = "bundle.css";

        FS.readdir(dirname, (error, filenames) => {
            if (!error) {
                filenames
                    .filter(filename => Utils.isCSS(filename))
                    .forEach(filename => {
                        if (filename !== targetFileName) {
                            let readStream = FS.createReadStream(Path.join(dirname, filename));
                            readStream.on("error", _ => logger.error("Read Stream error..."));
                            readStreams.push(readStream);
                        }
                    });

                let writeStream = FS.createWriteStream(Path.join(dirname, targetFileName));
                writeStream.on("error", _ => logger.error("Write Stream error..."));

                readStreams.forEach(stream => {
                    stream.pipe(writeStream, {end: false});
                });
            }
        });
    } catch (e) {
        Utils.renderHelpNotification(`An error occurred while reading the file [${e}]`.red);
    }
};

/**
 * Helper function for through2
 * @param {Buffer} buffer 
 * @param {string} encoding 
 * @param {Function} next 
 */
function write (buffer, encoding, next) {
    this.push(buffer.toString().toUpperCase()); 
    next();
};

/**
 * Helper function for through2
 * @param {Function} done 
 */
function end (done) {
    done();
};

/**
 * Create parser instance
 */
const parser = new CommandsParser(
    Minimist(inArguments, {
        alias: Utils.aliasObject,
        string: Utils.commands
    }
));

/**
 * Register available actions
 */
parser
    .registerAction("reverse", {paramTypes: ["string"], action: reverse})
    .registerAction("transform", {paramTypes: ["string"], action: transform})
    .registerAction("outputFile", {paramTypes: ["filePath"], action: outputFile})
    .registerAction("convertFromFile", {paramTypes: ["filePath"], action: convertFromFile})
    .registerAction("convertToFile", {paramTypes: ["filePath"], action: convertToFile})
    .registerAction("cssBundler", {paramTypes: ["path"], action: cssBundler})
    .execute();
