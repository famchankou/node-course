import Mongoose from "mongoose";
const Schema = Mongoose.Schema;

const User = new Schema({
    id: { type: String, unique: true, required : true },
    name: String,
    surname: String,
    age: Number,
    email: String,
    password: String,
    username: String,
    lastModifiedDate: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { collection: "mongoose_users"});

User.pre("save", function(next) {
    this.lastModifiedDate = new Date().toString();
    next();
});

export default Mongoose.model("User", User);
