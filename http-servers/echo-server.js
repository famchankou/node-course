const HTTP = require("http");
const URL = require("url");
const QueryString = require("querystring");
const PORT = process.env.PORT || 3000;

const accept = (request, response) => {
    response.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
    });

    const URLParams = URL.parse(request.url, true);
    const query = URLParams.query;

    response.end(JSON.stringify({
        URL: request.url,
        Method: request.method,
        Query: query
    }));
}

HTTP.createServer(accept)
    .on("error", error => console.log(error))
    .listen(PORT, _ => console.log("Server is running at  => http://localhost:" + PORT + "/\nCTRL + C to shutdown"));
