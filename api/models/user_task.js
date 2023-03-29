'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class UserTask extends Model {
        static associate(models) {

            // Model association are defined here

            UserTask.belongsTo(models.User, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: 'userId',
                    allowNull: false
                },
            });
            UserTask.belongsTo(models.Task, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: 'taskId',
                    allowNull: false
                },
            });
        }
    }

    UserTask.init(
        {
            // Model attributes
        },
        {
            sequelize,
            modelName: 'UserTask',
        }
    );

    return UserTask;
};
