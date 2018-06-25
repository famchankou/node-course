'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        surname: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        age: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Product, {
            foreignKey: 'id',
            as: 'products',
        });
    };

    return User;
};