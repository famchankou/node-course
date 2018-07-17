import Express from "express";
import { ProductController } from "../controllers";
import { CheckTokenMiddleware } from "../middlewares";

const Router = Express.Router();

Router.post("/api/products", CheckTokenMiddleware.check, ProductController.create);
Router.put("/api/products/:id", CheckTokenMiddleware.check, ProductController.update);
Router.delete("/api/products/:id", CheckTokenMiddleware.check, ProductController.delete);
Router.get("/api/products/:id", CheckTokenMiddleware.check, ProductController.get);
Router.get("/api/products", CheckTokenMiddleware.check, ProductController.getAll);

Router.post("/api/mongo/products", CheckTokenMiddleware.check, ProductController.createViaMongo);
Router.put("/api/mongo/products/:id", CheckTokenMiddleware.check, ProductController.updateViaMongo);
Router.delete("/api/mongo/products/:id", CheckTokenMiddleware.check, ProductController.deleteViaMongo);
Router.get("/api/mongo/products/:id", CheckTokenMiddleware.check, ProductController.getViaMongo);
Router.get("/api/mongo/products", CheckTokenMiddleware.check, ProductController.getAllViaMongo);

module.exports = Router;
