import { UUIDGenerator } from "../helpers";

export class User {
    constructor(user) {
        this.id = UUIDGenerator.UUID16();
        this.name = user.name;
        this.surname = user.surname;
        this.age = user.age;
    }
}
