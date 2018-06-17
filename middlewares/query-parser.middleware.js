import * as URL from "url";

export class QueryParserMiddleware {
    static parseQueryParams(req, res, next) {
        req.parsedQuery = URL.parse(req._parsedUrl);
        next();
    }
}
