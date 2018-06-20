import Express from "express";
import { UserController } from "../controllers";
import { CheckTokenMiddleware } from "../middlewares";
import Passport from "passport";

const Router = Express.Router();

Router.get("/api/users", CheckTokenMiddleware.check, (req, res) => {
    let users = UserController.getUsers();
    
    res.send(JSON.stringify(users));
});

Router.get("/api/passport/users", (req, res) => {
    let users = UserController.getUsers();
    
    res.send(JSON.stringify(users));
});

module.exports = Router;
