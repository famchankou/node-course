const HTTP = require("http");
const QueryString = require("querystring");
const DIR = __dirname;
const PORT = process.env.PORT || 3000;
const template = echo =>
`<html>
    <head></head>
    <body style="display:flex;justify-content:center;align-items:center;background-color:aliceblue;">
        <section>
            <h3>Echo: ${echo}</h3>
            <form action="/" method="post">
                <label for="echo"></label>
                <input name="echo" id="echo" value="">
                <button>Echo</button>
            </form>        
        </section>
    </body>
</html>`;

HTTP.createServer()
    .on("request", (request, response) => {
        const { url, method, headers } = request;
        const userAgent = headers["user-agent"];
        response.writeHead(200, { "Content-Type": "text/html" });

        if (request.method === "GET") {
            response.end(template(""));
        } else if (request.method === "POST") {
            let body = "", post = {};
    
            request.on("data", data => {
                body += data;
                if (body.length > 1e6) request.connection.destroy();
                post = QueryString.parse(body);
            });
    
            request.on("end", _ => {
                post = QueryString.parse(body);
                response.writeHead(200, { "Content-Type": "text/html" });
                response.end(template(post.echo));
                request.pipe(response);
            });
        }

    })
    .on("error", error => console.log(error))
    .listen(PORT, _ => console.log("Server is running at  => http://localhost:" + PORT + "/\nCTRL + C to shutdown"));
