const { Model, DataTypes } = require("sequelize");

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

  SubTask.init(
    {
      // model attributes
      subtaskTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A subtask text is required.",
          },
          notEmpty: {
            msg: "Please provide a subtask text.",
          },
        },
      },
      isComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "SubTask",
    }
  );

  return SubTask;
};
