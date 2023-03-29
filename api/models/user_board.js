'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class UserBoard extends Model {

        // Model association are defined here

        static associate(models) {
            UserBoard.belongsTo(models.User, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: 'userId',
                    allowNull: false
                },
            });
            UserBoard.belongsTo(models.Board, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: 'boardId',
                    allowNull: false
                },
            });
        }
    }

    UserBoard.init(
        {
            // Model attributes
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
        },
        {
            sequelize,
            modelName: 'UserBoard',
        }
    );

    return UserBoard;
};
