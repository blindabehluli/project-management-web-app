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
        allowNull: true,
      },
      isComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "SubTask",
      tableName: "SubTask",
    }
  );

  return SubTask;
};
