const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class SubTask extends Model {
        static associate(models) {

            // Model association are defined here

            SubTask.belongsTo(models.Task, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "taskId",
                    allowNull: false,
                },
            });
        }
    }

    SubTask.init({
        // model attributes
    }, {
        sequelize,
        modelName: 'SubTask',
    });

    return SubTask;
};
