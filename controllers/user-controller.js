import { User } from "../models";
import BC from "bcryptjs";

class UserController {
    constructor() {
        this.initUsers();
    }

    getUsers() {
        return this.users;
    }

    getUser(username, password) {
        return this.users.find(_user => _user.username === username && BC.compareSync(password, _user.password));
    }

    addUser(user) {
        this.users.push(user);
        return this.users.find(_user => _user.id === user.id);
    }

    initUsers() {
        this.users = [
            new User({username: "@John", name: "John", surname: "Dowe", email: "john@gmail.com", password: BC.hashSync("1234", BC.genSaltSync(10)), age: 23}),
            new User({username: "@Michale", name: "Michale", surname: "Smith", email: "smith@gmail.com", password: BC.hashSync("1234", BC.genSaltSync(10)), age: 27}),
            new User({username: "@Jimmy", name: "Jimmy", surname: "O'Sallivan", email: "osallivan@gmail.com", password: BC.hashSync("1234", BC.genSaltSync(10)), age: 37}),
            new User({username: "@Douglas", name: "Douglas", surname: "Crockford", email: "crockford@gmail.com", password: BC.hashSync("1234", BC.genSaltSync(10)), age: 26})
        ];

        return this;
    }
}

module.exports = new UserController();
