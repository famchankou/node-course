import Express from "express";
import { ProductController } from "../controllers";

const Router = Express.Router();

Router.get("/api/products", (req, res) => {
    res.render("index", {
        title: "Home"
    });
});

Router.get("/api/products/:id", (req, res) => {
    console.log(req.params.id);
    res.render("about", {
        title: "About"
    });
});

Router.get("/api/products/:id/reviews", (req, res) => {
    console.log(req.params.id);
    res.render("contact", {
        title: "Contact"
    });
});

Router.post("/api/products", (req, res) => {
    res.render("about", {
        title: "About"
    });
});

module.exports = Router;
