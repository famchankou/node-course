import { Mongoose } from "mongoose";
const Schema = Mongoose.Schema;

const Product = new Schema({
    id: { type: String, unique: true, required : true },
    userId: Number,
    name: String,
    sku: String,
    basePrice: Number,
    productType: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { collection: "mongoose_cities"});

module.exports = Mongoose.model("Product", Product);
