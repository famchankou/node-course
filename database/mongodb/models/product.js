import Mongoose from "mongoose";
const Schema = Mongoose.Schema;

const Product = new Schema({
    id: { type: String, unique: true, required : true },
    userId: Number,
    name: String,
    sku: String,
    basePrice: Number,
    productType: String,
    lastModifiedDate: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { collection: "mongoose_products"});

Product.pre("save", function (next) {
    this.lastModifiedDate = new Date().toString();
    next();
});

export default Mongoose.model("Product", Product);
