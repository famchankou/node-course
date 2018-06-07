import { Product, Review } from "../models";

export class ProductController {
    constructor() {
        this.initProducts().initProductsReviews();
    }

    getProducts() {
        return this.products;
    }

    getProduct(id) {
        return this.products.find(product => product.id === id);
    }

    getProductReviews() {
        return this.reviews;
    }

    getProductReview(id) {
        return this.reviews.get(id);
    }

    createProduct(product) {
        this.addProduct(product);
    }

    addProduct(product) {
        this.products.push(product);

        return this;
    }

    removeProduct(id) {
        this.products.splice(this.products.findIndex(product => product.id === id), 1);
        this.reviews.delete(id);

        return this;
    }

    initProducts() {
        this.products = [
            new Product({name: "Apple Watch", sku: "KHG-34", basePrice: 150, productType: "Electronics"}),
            new Product({name: "Apple MacBook Pro", sku: "LNS-104", basePrice: 1500, productType: "Electronics"}),
            new Product({name: "Adidas T-Shirt", sku: "GOH-12", basePrice: 100, productType: "Clothes"}),
            new Product({name: "Nike Dunk", sku: "PLS-789", basePrice: 330, productType: "Shoes"})
        ];

        return this;
    }

    initProductsReviews() {
        this.reviews = new Map();
        
        this.products.forEach(product => {
            this.reviews.set(product.id, [
                new Review({contractorId: product.id, description: "long description 1", title: "short description 1"}),
                new Review({contractorId: product.id, description: "long description 2", title: "short description 2"}),
                new Review({contractorId: product.id, description: "long description 3", title: "short description 3"})
            ]);
        });

        return this;
    }
}
