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
            });

            Task.hasMany(models.Attachment, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "taskId",
                    allowNull: false,
                },
            });

            Task.hasMany(models.Comment, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "taskId",
                    allowNull: false,
                },
            });

            Task.belongsTo(models.Column, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "columnId",
                    allowNull: false,
                },
            });

            Task.belongsToMany(models.User, {
                through: models.TaskAssignees,
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "taskId",
                    allowNull: false,
                },
                otherKey: 'userId',
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
