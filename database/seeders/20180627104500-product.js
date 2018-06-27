'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Products', [
            {
                "id": 1,
                "userId": 1,
                "name": "Nike Dunk 998",
                "sku": "FG-144",
                "basePrice": 451.33,
                "productType": "Shoes",
                "updatedAt": new Date(),
                "createdAt": new Date()
            },
            {
                "id": 2,
                "userId": 2,
                "name": "Reebok Custom Classic Leather",
                "sku": "HD-34859",
                "basePrice": 99.99,
                "productType": "Shoes",
                "updatedAt": new Date(),
                "createdAt": new Date()
            },
            {
                "id": 3,
                "userId": 1,
                "name": "Reebok Classic Leather 2",
                "sku": "LDKF-234",
                "basePrice": 129.99,
                "productType": "Shoes",
                "updatedAt": new Date(),
                "createdAt": new Date()
            },
            {
                "id": 4,
                "userId": 2,
                "name": "Adidas Harden MVP Tee",
                "sku": "ADS-2344",
                "basePrice": 33.34,
                "productType": "Men's Athletics",
                "updatedAt": new Date(),
                "createdAt": new Date()
            },
            {
                "id": 5,
                "userId": 1,
                "name": "Adidas Freelift Gradient Tee",
                "sku": "KL-789",
                "basePrice": 55,
                "productType": "Men's Training",
                "updatedAt": new Date(),
                "createdAt": new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Products', null, {});
    }
};
