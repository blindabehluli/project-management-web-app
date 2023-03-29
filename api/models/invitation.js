const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Invitation extends Model {
        static associate(models) {

            // Model association are defined here

            Invitation.belongsTo(models.Workspace, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "workspaceId",
                    allowNull: false,
                },
            });
            Invitation.belongsTo(models.Board, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "boardId",
                    allowNull: false,
                },
            });
        }
    }

    Invitation.init({
        // model attributes
    }, {
        sequelize,
        modelName: 'Invitation',
    });

    return Invitation;
};
