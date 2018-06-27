import { UUIDGenerator } from "../helpers";

export class Review {
    constructor(review) {
        this.id = review.id;
        this.productId = review.productId;
        this.userId = review.userId;
        this.description = review.description;
        this.title = review.title;
    }
}
