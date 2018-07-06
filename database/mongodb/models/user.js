import { Mongoose } from "mongoose";
const Schema = Mongoose.Schema;

const User = new Schema({
    id: { type: String, unique: true, required : true },
    name: String,
    surname: String,
    age: Number,
    email: String,
    password: String,
    username: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { collection: "mongoose_cities"});

module.exports = Mongoose.model("User", User);
