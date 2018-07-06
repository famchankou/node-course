import City from "../database/mongodb/models/city";

export class CityController {
    static create(req, res) {
        City.create({
            name: req.body.name,
            country: req.body.country,
            capital: req.body.capital,
            location: {
                lat: req.body.location.lat,
                long: req.body.location.long,
            }
        }, (error, city) => {
            if (error) console.log(error);
            res.send("saved");
        });
    }

    static update(req, res) {
        City.updateOne({ _id: req.params.id }, {
            name: req.body.name,
            country: req.body.country,
            capital: req.body.capital,
            location: {
                lat: req.body.location.lat,
                long: req.body.location.long,
            }
        }, (error, updatedObj) => {
            res.end(`City updated ${JSON.stringify(updatedObj)}`);
        });
    }

    static delete(req, res) {
        City.deleteOne({ _id: req.params.id }, (error) => {
            if (error) console.log(error);
            
            res.end(`City with ID ${req.params.id} removed...`);
        });
    }

    static getAll(req, res) {
        City.find({}, (error, cities) => {
            if (error) console.log(error);
            if (cities.length === 0) {
                res.end("No cities found...");
            } else {
                res.end(JSON.stringify(cities));
            }
        });
    }

    static get(req, res) {
        City.findOne({name: req.params.name, country: req.params.country}, (error, city) => {
            if (error) console.log(error);
            res.send(JSON.stringify(city));
        })
    }
}
