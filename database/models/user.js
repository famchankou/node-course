'use strict';
module.exports = (Sequelize, DataTypes) => {
    var User = Sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Product, {
            foreignKey: 'id',
            as: 'products',
        });
        User.hasMany(models.Review, {
            foreignKey: 'id',
            as: 'reviews',
        });
    };

    return User;
};