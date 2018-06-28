'use strict';
module.exports = (Sequelize, DataTypes) => {
    var Review = Sequelize.define('Review', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            onDelete: 'CASCADE',
            references: {
                model: 'Products',
                key: 'id',
                as: 'productId',
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            onDelete: 'CASCADE',
            references: {
                model: 'Users',
                key: 'id',
                as: 'userId',
            },
        }
    });

    Review.associate = (models) => {
        Review.belongsTo(models.Product, {
            foreignKey: 'id',
            onDelete: 'CASCADE',
        });
        Review.belongsTo(models.User, {
            foreignKey: 'id',
            onDelete: 'CASCADE',
        });
    };

    return Review;
};