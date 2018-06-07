import { UUIDGenerator } from "../helpers";

export class Product {
    constructor(product) {
        this.id = product.id ? product.id : UUIDGenerator.UUID16();
        this.name = product.name;
        this.sku = product.sku;
        this.basePrice = product.basePrice;
        this.productType = product.productType;
    }
}
