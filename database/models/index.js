import * as Path from "path";
import { readdirSync } from "fs";
import { Sequelize } from "sequelize";

const basename = Path.basename(module.filename);
const env = process.env.NODE_ENV || "development";
const config = require(Path.join(__dirname, "..", "config.json"))[env];
const DB = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

readdirSync(Path.join(__dirname))
    .filter((file) => (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        const model = sequelize.import(Path.join(__dirname, file));
        DB[model.name] = model;
    });

Object.keys(DB).forEach((modelName) => {
    if (DB[modelName].associate) {
        DB[modelName].associate(DB);
    }
});

DB.sequelize = sequelize;
DB.Sequelize = Sequelize;

export default DB;
