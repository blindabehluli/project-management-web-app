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
        through: models.TaskAssignee,
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "taskId",
          allowNull: false,
        },
        otherKey: "userId",
      });
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
        type: DataTypes.ENUM("low", "mid", "high"),
        allowNull: false,
        defaultValue: "low",
        validate: {
          isIn: {
            args: [["low", "mid", "high"]],
            msg: "Task priority must be low, mid, or high.",
          },
        },
      },
      taskLabel: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "Task"
    }
  );

  return Task;
};
