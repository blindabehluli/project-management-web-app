const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Workspace extends Model {
        static associate(models) {

            // Model association are defined here

            Workspace.hasMany(models.Invitation, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "workspaceId",
                    allowNull: false,
                },
                onDelete: 'CASCADE'
            });
            Workspace.hasMany(models.Board, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "workspaceId",
                    allowNull: false,
                },
                onDelete: 'CASCADE'
            });
            Workspace.belongsToMany(models.User, {
                through: models.UserWorkspace,
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "workspaceId",
                    allowNull: false,
                },
                otherKey: 'userId',
            });

            Workspace.belongsTo(models.User, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "userId",
                    allowNull: false,
                },
            });
        }
    }

    Workspace.init({
        // model attributes
    }, {
        sequelize,
        modelName: 'Workspace',
    });

    return Workspace;
};
