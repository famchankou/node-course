'use strict';
module.exports = (sequelize, DataTypes) => {
    var Review = sequelize.define('Review', {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false
        },
        product_id: {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {
                model: 'Products',
                key: 'id',
                as: 'product_id',
            },
        },
        user_id: {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {
                model: 'Users',
                key: 'id',
                as: 'user_id',
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