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
    lastModifiedDate: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { collection: "mongoose_cities"});

City.pre("save", function(next) {
    this.lastModifiedDate = new Date().toString();
    next();
});

export default Mongoose.model("City", City);
