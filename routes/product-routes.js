import Express from "express";
import { ProductController } from "../controllers";
import { Product } from "../models";

const Router = Express.Router();

Router.get("/api/products", (req, res) => {
    let products = ProductController.getProducts();

    res.send(JSON.stringify(products));
});

Router.get("/api/products/:id", (req, res) => {
    let id = req.params.id;
    let product = null;

    if (id && id.length) {
        product = ProductController.getProduct(id);
    }

    res.send(JSON.stringify(product));
});

Router.get("/api/products/:id/reviews", (req, res) => {
    let id = req.params.id;
    let review = null;

    if (id && id.length) {
        review = ProductController.getProductReview(id);
    }

    res.send(JSON.stringify(review));
});

Router.post("/api/products", (req, res) => {
    let product = null;

    if (req.body) {
        product = new Product(req.body);
        ProductController.addProduct(product);
    }
    
    res.send(JSON.stringify(product));
});

module.exports = Router;
