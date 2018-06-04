const HTTP = require("http");
const FS = require("fs");
const Path = require("path");
const Stream = require("stream");
const ReadableStream = new Stream.PassThrough();

const DIR = __dirname;
const PORT = 3000;
const templateName = "index.html";

class Utils {
    static interpolate(str, context) {
        for (var key in context) {
            str = str.replace("{" + key + "}", context[key]);
        }
        return str;
    }
}

HTTP.createServer()
    .on("request", (request, response) => {
        const { url, method, headers } = request;
        const userAgent = headers["user-agent"];
        response.writeHead(200, {
            "Content-Type": "text/html"
        });

        let template = Buffer.from(FS.readFileSync(Path.join(DIR, templateName))).toString("utf8");
        let interpolatedTemplate = Utils.interpolate(template, {message: "Render Interpolated Variable From Template"});

        response.write(interpolatedTemplate);
        response.end();

        // ReadableStream.write(interpolatedTemplate);
        // ReadableStream.pipe(response);
        // ReadableStream.end();

    })
    .listen(PORT);