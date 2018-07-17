import Mongoose from "mongoose";
const Schema = Mongoose.Schema;

const Product = new Schema({
    id: { type: String, unique: true, required : true },
    userId: Number,
    name: {
        type: String,
        validate: {
            validator: v => /^[A-Z].[\w\W0-9]*$/.test(v),
            message: message => `[${message.value}] is not a valid product name!`
        },
        required: [true, 'Product name is required']
    },
    sku: {
        type: String,
        validate: {
            validator: v => /[A-Za-z]*[0-9]*\w*/.test(v),
            message: message => `[${message.value}] is not a valid sku!`
        },
        required: [true, 'Sku is required']
    },
    basePrice: {
        type: Number,
        validate: {
            validator: v => /\D*/.test(v),
            message: message => `[${message.value}] is not valid base price!`
        },
        required: [true, 'Base price is required']
    },
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
