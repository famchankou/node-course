import { UUIDGenerator } from "../helpers";

export class Review {
    constructor(review) {
        this.id = review.id ? review.id : UUIDGenerator.UUID16();
        this.contractorId = review.contractorId;
        this.description = review.description;
        this.title = review.title;
    }
}
