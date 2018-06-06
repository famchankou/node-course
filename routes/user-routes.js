import Express from "express";
import { UserController } from "../controllers";

const Router = Express.Router();
const userConstroller = new UserController();

Router.get("/api/users", (req, res) => {
    let users = userConstroller.getUsers();
    res.send(JSON.stringify(users));
});

module.exports = Router;
