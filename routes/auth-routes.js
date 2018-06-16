import Express from "express";
import JWT from "jsonwebtoken";
import BC from "bcryptjs";

import { UserController } from "../controllers";
import config from "../config";

const Router = Express.Router();

Router.post("/auth", (req, res) => {
    let user = UserController.getUser(req.body.name, req.body.email);

    if (user && BC.compareSync(req.body.password, user.password)) {
        let token = JWT.sign({ id: user.id }, config.secret, { expiresIn: 86400 });

        res.status(200).send({
            "code": 200,
            "message": "OK",
            "data": {
                "user": {
                    "email": user.email,
                    "username": user.name
                }
            },
            "token": token
        });
    } else {
        res.status(404).send({
            "code": 404,
            "message": "Not Found",
            "data": {}
        });
    }
});

module.exports = Router;
