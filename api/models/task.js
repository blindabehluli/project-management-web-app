const { Model, DataTypes } = require("sequelize");

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

      Task.belongsTo(models.Column, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "columnId",
          allowNull: false,
        },
      });
    }

    async createSubtask(subtaskData) {
      const subtask = await this.createSubTask(subtaskData);
      return subtask;
    }
  }

  Task.init(
    {
      // model attributes
      taskTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Task title is required.",
          },
          notEmpty: {
            msg: "Please provide the task title.",
          },
        },
      },
      taskDescription: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      taskPriority: {
        type: DataTypes.ENUM("Low", "Medium", "High"),
        allowNull: true,
      },
      taskLabel: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Task label is required.",
          },
          notEmpty: {
            msg: "Please provide the task label.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "Task",
    }
  );

  return Task;
};
