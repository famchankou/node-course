import User from "../database/mongodb/models/user";
import DB from "../database/models";
import BC from "bcryptjs";

export class UserController {
    static create(req, res) {
        return DB.User
            .create({...req.body, password: BC.hashSync(req.body.password, BC.genSaltSync(10))})
            .then(user => res.status(201).send(user))
            .catch(error => res.status(400).send(error));
    }

    static update(req, res) {
        return DB.User
            .findById(req.params.id)
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: "User Not Found",
                    });
                }

                return user
                    .update({
                        name: req.body.name || user.name,
                        surname: req.body.surname || user.surname,
                        age: req.body.age || user.age,
                        username: req.body.username || user.username,
                        email: req.body.email || user.email,
                        password: req.body.password ? BC.hashSync(req.body.password, BC.genSaltSync(10)) : user.password,
                    })
                    .then(() => res.status(200).send(user))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    }

    static delete(req, res) {
        return DB.User
            .find({
                where: {
                    id: req.params.id
                }
            })
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: "User Not Found",
                    });
                }

                return user
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }

    static get(req, res) {
        return DB.User
            .find({
                where: {
                    username: req.body.username,
                    email: req.body.email
                }
            })
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: "User Not Found",
                    });
                }

                return res.status(200).send(user);
            })
            .catch(error => res.status(400).send(error));
    }

    static getAll(req, res) {
        return DB.User
            .findAll()
            .then(users => {
                if (!users.length) {
                    return res.status(404).send({
                        message: "Users Not Found",
                    });
                }

                return res.status(200).send(users);
            })
            .catch(error => res.status(400).send(error));
    }

    static createViaMongo(req, res) {
        User.create({
            id: req.body.id,
            name: req.body.name,
            surname: req.body.surname,
            age: req.body.age,
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
        }, (error, user) => {
            if (error) {
                res.send(JSON.stringify(error));
            } else {
                res.send(`User created: ${JSON.stringify(user)}`);
            }
        });
    }

    static updateViaMongo(req, res) {
        User.updateOne({ _id: req.params.id }, {
            name: req.body.name,
            surname: req.body.surname,
            age: req.body.age,
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
        }, (error, updatedObj) => {
            if (error) {
                res.send(JSON.stringify(error));
            } else {
                res.end(`User updated ${JSON.stringify(updatedObj)}`);
            }
        });
    }

    static deleteViaMongo(req, res) {
        User.deleteOne({ _id: req.params.id }, (error) => {
            if (error) {
                res.send(JSON.stringify(error));
            } else {
                res.end(`User with ID ${req.params.id} removed...`);
            }
        });
    }

    static getAllViaMongo(req, res) {
        User.find({}, (error, users) => {
            if (error) {
                res.send(JSON.stringify(error));
            } else {
                if (users.length === 0) {
                    res.end("No users found...");
                } else {
                    res.end(JSON.stringify(users));
                }
            }
        });
    }

    static getViaMongo(req, res) {
        User.findOne({_id: req.params.id}, (error, user) => {
            if (error) {
                res.send(JSON.stringify(error));
            } else {
                res.send(JSON.stringify(user));
            }
        })
    }
}
