const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Task extends Model {
        static associate(models) {

            // Model association are defined here

            Task.hasMany(models.SubTask, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "taskId",
                    allowNull: false,
                },
                onDelete: 'CASCADE'
            });
            Task.belongsTo(models.Column, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "columnId",
                    allowNull: false,
                },
            });
        }
    }

    Task.init({
        // model attributes
    }, {
        sequelize,
        modelName: 'Task',
    });

    return Task;
};
