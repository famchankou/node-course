import JWT from "jsonwebtoken";
import config from "../config";

const EXCLUDED_URLS = [
    "/auth",
    "/passport/auth/local",
    "/api/users/auth"
];

export class CheckTokenMiddleware {
    static check(req, res, next) {
        let token = req.headers["x-access-token"];

        if (EXCLUDED_URLS.includes(req.parsedQuery.path)) {
            next();
        } else {
            if (!token) {
                res.status(401).send({ auth: false, message: 'No token provided.' });
            } else {
                JWT.verify(token, config.secret, (err, decoded) => {
                    if (err) {
                        res.status(404).json({ auth: false, message: 'Failed to authenticate token.' });
                    } else {
                        next();
                    }
                });
            }
        }
    }
}
