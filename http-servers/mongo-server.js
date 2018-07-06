const HTTP = require("http");
const MongoConnector = require("../database/mongodb/index");

const PORT = process.env.PORT || 3000;

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

HTTP.createServer()
    .on("request", (request, response) => {
        const { url, method } = request;
        response.writeHead(200, {
            "Content-Type": "text/plain"
        });

        MongoConnector.start();
        MongoConnector.createCollection();
        MongoConnector.findAll((data) => {
            if (data.length) {
                response.end(JSON.stringify(data[getRandomInt(0, data.length - 1)]));
            } else {
                MongoConnector.insertDocuments(data => {
                    response.end(JSON.stringify(data.ops[getRandomInt(0, data.ops.length - 1)]));
                });
            }
        });
    })
    .on("error", error => console.log(error))
    .listen(PORT, _ => console.log("Server is running at  => http://localhost:" + PORT + "/\nCTRL + C to shutdown"));
