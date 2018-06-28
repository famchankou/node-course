import DB from "../database/models";

export class ReviewController {
    static create(req, res) {
        return DB.Review
            .create({
                ...req.body,
                userId: req.body.userId,
                productId: req.body.productId
            })
            .then(review => res.status(201).send(review))
            .catch(error => res.status(400).send(error));
    }

    static getAll(req, res) {
        return DB.Review
            .findAll({
                where: {
                    productId: req.params.id
                }
            })
            .then(reviews => {
                if (!reviews.length) {
                    return res.status(404).send({
                        message: "Reviews Not Found",
                    });
                }

                return res.status(200).send(reviews);
            })
            .catch(error => res.status(400).send(error));
    }
}