import Express from "express";
import { ProductController } from "../controllers";
import { CheckTokenMiddleware } from "../middlewares";

const Router = Express.Router();

Router.post("/api/products", CheckTokenMiddleware.check, ProductController.create);
Router.put("/api/products/:id", CheckTokenMiddleware.check, ProductController.update);
Router.delete("/api/products/:id", CheckTokenMiddleware.check, ProductController.delete);
Router.get("/api/products/:id", CheckTokenMiddleware.check, ProductController.get);
Router.get("/api/products", CheckTokenMiddleware.check, ProductController.getAll);

module.exports = Router;
