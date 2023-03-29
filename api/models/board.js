const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Board extends Model {
        static associate(models) {

            // Model association are defined here

            Board.hasMany(models.Invitation, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "boardId",
                    allowNull: false,
                },
                onDelete: 'CASCADE'
            });
            Board.hasMany(models.Column, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "boardId",
                    allowNull: false,
                },
                onDelete: 'CASCADE'
            });
            Board.hasMany(models.BoardImage, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "boardId",
                    allowNull: false,
                },
                onDelete: 'CASCADE'
            });
            Board.belongsToMany(models.User, {
                through: models.UserBoard,
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "boardId",
                    allowNull: false,
                },
                otherKey: 'userId',
            });
            Board.belongsTo(models.Workspace, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "workspaceId",
                    allowNull: false,
                },
            });
        }
    }

    Board.init({
        // model attributes
    }, {
        sequelize,
        modelName: 'Board',
    });

    return Board;
};
