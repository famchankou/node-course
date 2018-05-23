const Repl = require("repl");
const FS = require("fs");
const Path = require("path");
const Colors = require("colors");
const Minimist = require("minimist");
const Winston = require("winston");
const Converter = require("csvtojson").Converter;
const Request = require("request");

const Through = require("through2");
const TRStream = Through(write, end);

function write (buffer, encoding, next) {
    this.push(buffer.toString().toUpperCase()); 
    next();
};

function end (done) {
    done();
};

const DATA_DIR = Path.join(__dirname, "..", "data");
const REMOTE_CONTENT_URL = "https://epa.ms/nodejs18-hw3-css";

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

        if (void 0 !== config.help) {
            this.renderHelpNotification(config);
            return this;
        }
        
        if (config.actionType && this.actions.has(config.actionType)) {
            let actionObject = this.actions.get(config.actionType);
            let param = config[actionObject.paramTypes[0]];

            if (param && "=" !== param) {
                actionObject.action(param);
            } else if (config.extra.length) { 
                actionObject.action(config.extra[0]);
            } else {
                console.log(`No such action or param [${config.actionType} ${param}]`);
            }
            
        }
    }

    renderHelpNotification(config = null) {
        console.log(`Config help ...`);
    }
}

const parser = new CommandsParser(
    Minimist(process.argv.slice(2), {
        alias: Utils.aliasObject,
        string: Utils.commands
    }
));

parser.registerAction("reverse", {paramTypes: ["string"], action: reverse})
    .registerAction("transform", {paramTypes: ["string"], action: transform})
    .registerAction("outputFile", {paramTypes: ["filePath"], action: outputFile})
    .registerAction("convertFromFile", {paramTypes: ["filePath"], action: convertFromFile})
    .registerAction("convertToFile", {paramTypes: ["filePath"], action: convertToFile})
    .registerAction("cssBundler", {paramTypes: ["path"], action: cssBundler})
    .execute();

//////////////////////////////////////////////////////////
////////////////////// Actions ///////////////////////////
//////////////////////////////////////////////////////////

function reverse (str) {
    const reverse = str => str.split``.reverse().join``;

    const Readline = require("readline");
    const RLStream = Readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });


    console.log(reverse(str));
    RLStream.on("line", str => {
        console.log(reverse(str));
    })
};

function transform (str) {
    process.stdin.pipe(TRStream).pipe(process.stdout);
};

function outputFile (filePath) {
    let file = Path.join(DATA_DIR, filePath);
    
    let fd = FS.openSync(file, "r");
    let readStream = FS.createReadStream(null, {fd: fd});
    readStream.pipe(process.stdout);
};

function convertFromFile (filePath) {
    let file = Path.join(DATA_DIR, filePath);

    let csvConverter = new Converter({constructResult: false, toArrayString: true});
    let readStream = FS.createReadStream(file);
    readStream.pipe(csvConverter).pipe(process.stdout);
};

function convertToFile (filePath) {
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
};

function cssBundler (path) {
    let dirname = Path.join(DATA_DIR, path);
    let readStreams = [];
    let targetFileName = "bundle.css";

    FS.readdir(dirname, (error, filenames) => {
        if (!error) {
            filenames
                .filter(filename => Utils.isCSS(filename))
                .forEach(filename => {
                    let readStream = FS.createReadStream(Path.join(dirname, filename));
                    readStream.on("error", _ => console.log("Read Stream error..."));
                    readStreams.push(readStream);
                });

            let writeStream = FS.createWriteStream(Path.join(dirname, targetFileName));
            writeStream.on("error", _ => console.log("Write Stream error..."));

            readStreams.forEach(stream => {
                stream.pipe(writeStream, {end: false});
            });

            // let stream = Request(REMOTE_CONTENT_URL);
            // stream.pipe(FS.createWriteStream(Path.join(dirname, "remote.css")));
            // const write = stream.pipe(fs.createWriteStream(path))

            // readStreams.forEach(readStream => {
            //     readStream.on("end", function () {
            //         next2();
            //     });
            //     readStream.pipe(writeStream, {end: false});
            // });
        }
    });

};
