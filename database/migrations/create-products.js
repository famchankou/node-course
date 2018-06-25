export class CreateProducts {
    static up(queryInterface, Sequelize) {
        return queryInterface.createTable("Products", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
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
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    }

    static down(queryInterface /* , Sequelize */) {
        return queryInterface.dropTable("Products");
    }
}
