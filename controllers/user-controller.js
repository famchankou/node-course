import DB from "../database/models";
import BC from "bcryptjs";

export class UserController {
    static create(req, res) {
        return DB.User
            .create({...req.body, password: req.body.password})
            .then(user => res.status(200).send(user))
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
                        password: req.body.password || user.password,
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
                    id: req.params.id
                }
            })
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: "User Not Found",
                    });
                }

                res.status(200).send(user);
            })
            .catch(error => res.status(400).send(error));
    }

    static getAll(req, res) {
        return DB.User
            .find()
            .then(users => {
                if (!users.length) {
                    return res.status(404).send({
                        message: "Users Not Found",
                    });
                }

                res.status(200).send(JSON.stringify(users));
            })
            .catch(error => res.status(400).send(error));
    }
}
