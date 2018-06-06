import Express from "express";
import { ProductController } from "../controllers";

const Router = Express.Router();
const productConstroller = new ProductController();

Router.get("/api/products", (req, res) => {
    console.log("Cookies", req.cookies);
    console.log("Query", req.parsedQuery);
    res.send("API Products");
});

Router.get("/api/products/:id", (req, res) => {
    console.log(req.params.id);
    res.send("API PRODUCT");
});

Router.get("/api/products/:id/reviews", (req, res) => {
    console.log(req.params.id);
    res.send("API PRODUCT REVIEW");
});

Router.post("/api/products", (req, res) => {
    res.send("API PRODUCT POST");
});

module.exports = Router;
