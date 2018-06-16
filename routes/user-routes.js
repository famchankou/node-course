import Express from "express";
import { UserController } from "../controllers";

const Router = Express.Router();

Router.get("/api/users", (req, res) => {
    let users = UserController.getUsers();
    
    res.send(JSON.stringify(users));
});

module.exports = Router;
