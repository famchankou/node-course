import Express from "express";
import { ProductController } from "../controllers";
import { CheckTokenMiddleware } from "../middlewares";

const Router = Express.Router();

Router.post("/api/products", ProductController.create);
Router.put("/api/products/:id", ProductController.update);
Router.delete("/api/products/:id", ProductController.delete);
Router.get("/api/products/:id", ProductController.get);
Router.get("/api/products", ProductController.getAll);

module.exports = Router;
