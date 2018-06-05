const HTTP = require("http");
const PORT = process.env.PORT || 3000;;

HTTP.createServer()
    .on("request", (request, response) => {
        const { url, method } = request;
        response.writeHead(200, {
            "Content-Type": "text/plain"
        });
        response.end("Hello World");
    })
    .on("error", error => console.log(error))
    .listen(PORT, _ => console.log("Server is running at  => http://localhost:" + PORT + "/\nCTRL + C to shutdown"));
