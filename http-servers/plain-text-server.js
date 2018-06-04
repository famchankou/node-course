const HTTP = require("http");
const PORT = 3000;

HTTP.createServer()
    .on("request", (request, response) => {
        const { url, method } = request;
        response.writeHead(200, {
            "Content-Type": "text/plain"
        });
        response.end("Hello World");
    })
    .listen(PORT);
