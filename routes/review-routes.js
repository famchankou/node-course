import Express from "express";
import { ReviewController } from "../controllers";
import { CheckTokenMiddleware } from "../middlewares";

const Router = Express.Router();

Router.post("/api/products/reviews", CheckTokenMiddleware.check, ReviewController.create);
Router.get("/api/products/:id/reviews", CheckTokenMiddleware.check, ReviewController.getAll);

module.exports = Router;
