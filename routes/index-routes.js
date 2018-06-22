import Express from "express";

const Router = Express.Router();

Router.get("/index", (req, res) => {
    res.send("");
});

module.exports = Router;
