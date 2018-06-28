import { UUIDGenerator } from "../helpers";

export class User {
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.age = user.age;
        this.email = user.email;
        this.password = user.password;
        this.username = user.username;
    }
}
