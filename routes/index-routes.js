import Express from "express";

const Router = Express.Router();

Router.get("/api/index", (req, res) => {
    res.send("");
});

module.exports = Router;
