'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class UserWorkspace extends Model {
        static associate(models) {

            // Model association are defined here

            UserWorkspace.belongsTo(models.User, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: 'userId',
                    allowNull: false
                },
            });
            UserWorkspace.belongsTo(models.Workspace, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: 'workspaceId',
                    allowNull: false
                },
            });
        }
    }

    UserWorkspace.init(
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
            modelName: 'UserWorkspace',
        }
    );

    return UserWorkspace;
};
