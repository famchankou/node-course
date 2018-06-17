import Express from "express";
import { UserController } from "../controllers";
import Passport from "passport";

const Router = Express.Router();

Router.get("/api/users", (req, res) => {
    let users = UserController.getUsers();
    
    res.send(JSON.stringify(users));
});

Router.get("/api/passport/users", Passport.authenticate("bearer", { session: false }), (req, res) => {
    let users = UserController.getUsers();
    
    res.send(JSON.stringify(users));
});

module.exports = Router;
