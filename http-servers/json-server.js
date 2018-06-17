const HTTP = require("http");
const FS = require("fs");
const Path = require("path");
const Stream = require("stream");
const ReadableStream = new Stream.PassThrough();

const DIR = __dirname;
const PORT = process.env.PORT || 3000;;
const product = {
    id: 1,
    name: 'Supreme T-Shirt',
    brand: 'Supreme',
    price: 99.99,
    options: [
        { color: 'blue' },
        { size: 'XL' }
    ]
};

HTTP.createServer()
    .on("request", (request, response) => {
        const { url, method, headers } = request;
        response.writeHead(200, {
            "Content-Type": "application/json"
        });

        response.write(JSON.stringify(product));
        response.end();
    })
    .on("error", error => console.log(error))
    .listen(PORT, _ => console.log("Server is running at  => http://localhost:" + PORT + "/\nCTRL + C to shutdown"));
