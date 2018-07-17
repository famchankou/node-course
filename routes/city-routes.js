import Express from "express";
import { CityController } from "../controllers";
import { CheckTokenMiddleware } from "../middlewares";

const Router = Express.Router();

Router.post("/api/mongo/cities", CheckTokenMiddleware.check, CityController.create);
Router.get("/api/mongo/cities", CheckTokenMiddleware.check, CityController.getAll);
Router.put("/api/mongo/cities/:id", CheckTokenMiddleware.check, CityController.update);
Router.delete("/api/mongo/cities/:id", CheckTokenMiddleware.check, CityController.delete);

module.exports = Router;
