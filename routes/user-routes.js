import Express from "express";
import { UserController } from "../controllers";
import { CheckTokenMiddleware } from "../middlewares";

const Router = Express.Router();

Router.post("/api/users", UserController.create);
Router.put("/api/users/:id", UserController.update);
Router.delete("/api/users/:id", UserController.delete);
Router.get("/api/users/:id", UserController.get);
Router.get("/api/users", UserController.getAll);

module.exports = Router;
