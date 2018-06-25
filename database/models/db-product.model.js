export class DBProduct {
    static model(sequelize, DataTypes) => {
        const Product = sequelize.define("Product", {
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onDelete: "CASCADE",
                references: {
                    model: "Users",
                    key: "id",
                    as: "user_id",
                },
            },
            sku: {
                type: Sequelize.STRING,
                allowNull: false
            },
            base_price: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            product_type: {
                type: Sequelize.STRING,
                allowNull: true
            }
        });

        Product.associate = (models) => {
            Product.belongsTo(models.User, {
                foreignKey: "id",
                onDelete: "CASCADE",
            });
            Product.hasMany(models.Review, {
                foreignKey: "id",
                as: "reviews",
            });
        };

        return Product;
    }
}
