import Express from "express";
import { UserController } from "../controllers";
import { CheckTokenMiddleware } from "../middlewares";

const Router = Express.Router();

Router.post("/api/users", UserController.create);
Router.put("/api/users/:id", CheckTokenMiddleware.check, UserController.update);
Router.delete("/api/users/:id", CheckTokenMiddleware.check, UserController.delete);
Router.post("/api/user", CheckTokenMiddleware.check, UserController.get);

Router.post("/api/mongo/users", CheckTokenMiddleware.check, UserController.createViaMongo);
Router.put("/api/mongo/users/:id", CheckTokenMiddleware.check, UserController.updateViaMongo);
Router.delete("/api/mongo/users/:id", CheckTokenMiddleware.check, UserController.deleteViaMongo);
Router.get("/api/mongo/users", CheckTokenMiddleware.check, UserController.getAllViaMongo);
Router.get("/api/mongo/users/:id", CheckTokenMiddleware.check, UserController.getViaMongo);

module.exports = Router;
