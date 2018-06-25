'use strict';
module.exports = (sequelize, DataTypes) => {
    var Review = sequelize.define('Review', {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.String,
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
        }
    });

    Review.associate = (models) => {
        Review.belongsTo(models.Product, {
            foreignKey: 'id',
            onDelete: 'CASCADE',
        });
    };

    return Review;
};