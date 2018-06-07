import { User } from "../models";

export class UserController {
    constructor() {
        this.initUsers();
    }

    getUsers() {
        return this.users;
    }

    initUsers() {
        this.users = [
            new User({name: "John", surname: "Dowe", age: 23}),
            new User({name: "Michale", surname: "Smith", age: 27}),
            new User({name: "Jimmy", surname: "O'Sallivan", age: 37}),
            new User({name: "Douglas", surname: "Crockford", age: 26})
        ];

        return this;
    }
}
