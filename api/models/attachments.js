const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Attachment extends Model {
        static associate(models) {

            // Model association are defined here

            Attachment.belongsTo(models.Task, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "taskId",
                    allowNull: false,
                },
            });
        }
    }

    Attachment.init({
        // model attributes
    }, {
        sequelize,
        modelName: 'Attachment',
    });

    return Attachment;
};
