import Express from "express";
import { UserController } from "../controllers";
import { CheckTokenMiddleware } from "../middlewares";

const Router = Express.Router();

Router.post("/api/users", UserController.create);
Router.put("/api/users/:id", CheckTokenMiddleware.check, UserController.update);
Router.delete("/api/users/:id", CheckTokenMiddleware.check, UserController.delete);
Router.post("/api/user", CheckTokenMiddleware.check, UserController.get);

module.exports = Router;
