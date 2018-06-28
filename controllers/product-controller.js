import DB from "../database/models";

export class ProductController {
    static create(req, res) {
        return DB.Product
            .create({
                ...req.body,
                userId: req.body.userId,
            })
            .then(product => res.status(201).send(product))
            .catch(error => res.status(400).send(error));
    }

    static update(req, res) {
        return DB.Product
            .find({
                where: {
                    id: req.params.id
                }
            })
            .then(product => {
                if (!product) {
                    return res.status(404).send({
                        message: "Product Not Found",
                    });
                }

                return product
                    .update({
                        userId: product.userId,
                        basePrice: req.body.basePrice || product.basePrice,
                        sku: req.body.sku || product.sku,
                        productType: req.body.productType || product.productType
                    })
                    .then(product => res.status(200).send(product))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }

    static delete(req, res) {
        return DB.Product
            .find({
                where: {
                    id: req.params.id
                }
            })
            .then(product => {
                if (!product) {
                    return res.status(404).send({
                        message: "Product Not Found",
                    });
                }

                return product
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }

    static get(req, res) {
        return DB.Product
            .find({
                where: {
                    id: req.params.id
                }
            })
            .then(product => {
                if (!product) {
                    return res.status(404).send({
                        message: "Product Not Found",
                    });
                }

                return res.status(200).send(product);
            })
            .catch(error => res.status(400).send(error));
    }

    static getAll(req, res) {
        return DB.Product
            .findAll()
            .then(products => {
                if (!products.length) {
                    return res.status(404).send({
                        message: "Products Not Found",
                    });
                }

                return res.status(200).send(products);
            })
            .catch(error => res.status(400).send(error));
    }
}
