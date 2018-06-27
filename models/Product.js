import { UUIDGenerator } from "../helpers";

export class Product {
    constructor(product) {
        this.id = product.id;
        this.userId = product.userId;
        this.name = product.name;
        this.sku = product.sku;
        this.basePrice = product.basePrice;
        this.productType = product.productType;
    }
}
