const HTTP = require("http");
const FS = require("fs");
const Path = require("path");

const DIR = __dirname;

HTTP
    .createServer()
    .on("request", (request, response) => {
        const { url, method } = request;
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        FS.createReadStream(Path.join(DIR, "index.html")).pipe(response);
    })
    .listen(3000);
