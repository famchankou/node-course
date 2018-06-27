'use strict';
const BC = require("bcryptjs");

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                id: "1",
                name: "John",
                surname: "Dowe",
                username: "@Dowe",
                email: "john_dowe@gmail.com",
                age: 66,
                password: BC.hashSync("1234", BC.genSaltSync(10)),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "2",
                name: "Michael",
                surname: "Jackson",
                username: "@Jackson",
                email: "michael_jackson@gmail.com",
                age: 66,
                password: BC.hashSync("1234", BC.genSaltSync(10)),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};