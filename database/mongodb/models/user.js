import Mongoose from "mongoose";
const Schema = Mongoose.Schema;

const User = new Schema({
    id: { type: String, unique: true, required : true },
    name: {
        type: String,
        validate: {
            validator: v => /^[A-Z][a-z]*$/.test(v),
            message: '{VALUE} is not a valid user name!'
        },
        required: [true, 'User name is required']
    },
    surname: {
        type: String,
        validate: {
            validator: v => /^[A-Z][a-z]*$/.test(v),
            message: '{VALUE} is not a valid User name!'
        },
        required: [true, 'User name is required']
    },
    age: Number,
    email: {
        type: String,
        validate: {
            validator: email => {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            },
            message: '{VALUE} is not a valid user email!'
        },
        required: [true, 'User email is required']
    },
    password: String,
    username: {
        type: String,
        validate: {
            validator: v => /^[\w\W]*[A-Z][a-z]*$/.test(v),
            message: '{VALUE} is not a valid username!'
        },
        required: [true, 'Username is required']
    },
    lastModifiedDate: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { collection: "mongoose_users"});

User.pre("save", function(next) {
    this.lastModifiedDate = new Date().toString();
    next();
});

export default Mongoose.model("User", User);
