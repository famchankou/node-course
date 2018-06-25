'use strict';
module.exports = (Sequelize, DataTypes) => {
    var Product = Sequelize.define('Product', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: 'CASCADE',
            references: {
                model: 'Users',
                key: 'id',
                as: 'userId',
            },
        },
        sku: {
            type: DataTypes.STRING,
            allowNull: false
        },
        basePrice: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        productType: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    Product.associate = (models) => {
        Product.belongsTo(models.User, {
            foreignKey: 'id',
            onDelete: 'CASCADE',
        });
        Product.hasMany(models.Review, {
            foreignKey: 'id',
            as: 'reviews',
        });
    };

    return Product;
};