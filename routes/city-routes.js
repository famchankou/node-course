import Express from "express";
import { CityController } from "../controllers";
import { CheckTokenMiddleware } from "../middlewares";

const Router = Express.Router();

Router.post("/api/cities", CheckTokenMiddleware.check, CityController.create);
Router.get("/api/cities", CheckTokenMiddleware.check, CityController.getAll);
Router.put("/api/cities/:id", CheckTokenMiddleware.check, CityController.update);
Router.delete("/api/cities/:id", CheckTokenMiddleware.check, CityController.delete);

module.exports = Router;
