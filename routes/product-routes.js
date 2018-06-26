import Express from "express";
import { ProductController } from "../controllers";
import { CheckTokenMiddleware } from "../middlewares";
import { Product } from "../models";

const Router = Express.Router();

Router.get("/api/products", CheckTokenMiddleware.check, (req, res) => {
    let products = ProductController.getProducts();

    res.send(JSON.stringify(products));
});

Router.get("/api/products/:id", CheckTokenMiddleware.check, (req, res) => {
    let id = req.params.id;
    let product = null;

    if (id && id.length) {
        product = ProductController.getProduct(id);
    }

    res.send(JSON.stringify(product));
});

Router.get("/api/products/:id/reviews", CheckTokenMiddleware.check, (req, res) => {
    let id = req.params.id;
    let review = null;

    if (id && id.length) {
        review = ProductController.getProductReview(id);
    }

    res.send(JSON.stringify(review));
});

Router.post("/api/products", CheckTokenMiddleware.check, (req, res) => {
    let product = null;

    if (req.body) {
        product = new Product(req.body);
        ProductController.addProduct(product);
    }
    
    res.send(JSON.stringify(product));
});

module.exports = Router;
