const HTTP = require("http");
const Mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const FIXTURES = require("../database/mongodb/fixtures.json");

Mongoose.connect("mongodb://localhost:27017/node-course");

const Schema = Mongoose.Schema;
const citySchema = new Schema({
    name: { type: String, required: true, unique: false },
    country: String,
    capital: Boolean,
    location: {
        lat: Number,
        long: Number
    },
    created_at: Date,
    updated_at: Date
}, { collection: "mongoose_cities"});
var City = Mongoose.model("City", citySchema);

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

HTTP.createServer()
    .on("request", (request, response) => {
        const { url, method } = request;
        response.writeHead(200, {
            "Content-Type": "text/plain"
        });
        
        City.find({}, (err, cities) => {
            if (err) throw err;
            if (cities.length === 0) {
                City.insertMany(FIXTURES, (error, docs) => {
                    if (error) {
                        console.log(`An error has been thrown while performing batch insert: [${error}]`)
                    } else {
                        response.end(JSON.stringify(docs[getRandomInt(0, docs.length - 1)]));
                        console.log(`The following documents have been created: ${docs}`);
                    }
                });
            } else {
                response.end(JSON.stringify(cities[getRandomInt(0, cities.length - 1)]));
            }
        });
    })
    .on("error", error => console.log(error))
    .listen(PORT, _ => console.log("Server is running at  => http://localhost:" + PORT + "/\nCTRL + C to shutdown"));