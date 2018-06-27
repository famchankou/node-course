'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Reviews', [
            {
                "id": 1,
                "productId": 1,
                "userId": 1,
                "description": "This is a review for Nike Dunk",
                "title": "Nike Dunk",
                "updatedAt": new Date(),
                "createdAt": new Date()
            },
            {
                "id": 2,
                "productId": 3,
                "userId": 2,
                "description": "This is a review for Reebok Classic Leather 2",
                "title": "Reebok Classic Leather 2",
                "updatedAt": new Date(),
                "createdAt": new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Reviews', null, {});
    }
};
