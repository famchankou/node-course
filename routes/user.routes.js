import Express from "express";
import { UserController } from "../controllers";

const Router = Express.Router();

Router.get("/api/users", (req, res) => {
    res.render("contact", {
        title: "Contact"
    });
});

module.exports = Router;
