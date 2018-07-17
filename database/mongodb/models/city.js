import Mongoose from "mongoose";
const Schema = Mongoose.Schema;

const City = new Schema({
    name: {
        type: String,
        validate: {
            validator: v => /^[A-Z][a-z]*$/.test(v),
            message: message => `[${message.value}] is not a valid city name!`
        },
        required: [true, 'City name is required']
    },
    country: {
        type: String,
        validate: {
            validator: v => /^[A-Z][a-z]*$/.test(v),
            message: message => `[${message.value}] is not a valid country name!`
        },
        required: [true, 'Country name is required']
    },
    capital: Boolean,
    location: {
        lat: {
            type: Number,
            validate: {
                validator: v => {
                    var num = parseFloat((v + "").replace(/^(.*\.\d\d)\d*$/, '$1'));
                    return num > 0 && num < 100;
                },
                message: message => `[${message.value}] is not valid latitude!`
            },
            required: [true, 'Latitude is required']
        },
        long: {
            type: Number,
            validate: {
                validator: v => {
                    var num = parseFloat((v + "").replace(/^(.*\.\d\d)\d*$/, '$1'));
                    return num > 0 && num < 100;
                },
                message: message => `[${message.value}] is not valid longitude!`
            },
            required: [true, 'Longitude is required']
        }
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
