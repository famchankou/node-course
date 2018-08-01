import Express from "express";

const Router = Express.Router();

Router.get("/api/error", (req, res) => {
    res.send("An error has occurred. Please make sure you did the right action.");
});

module.exports = Router;
