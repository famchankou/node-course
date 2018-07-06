import Mongoose from "mongoose";
const Schema = Mongoose.Schema;

const City = new Schema({
    name: { type: String, required: true, unique: false },
    country: String,
    capital: Boolean,
    location: {
        lat: Number,
        long: Number
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { collection: "mongoose_cities"});

export default Mongoose.model("City", City);
