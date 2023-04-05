"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class TaskAssignee extends Model {
    static associate(models) {
      // Model association are defined here

      TaskAssignee.belongsTo(models.User, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "userId",
          allowNull: false,
        },
      });
      TaskAssignee.belongsTo(models.Task, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "taskId",
          allowNull: false,
        },
      });
    }
  }

  TaskAssignee.init(
    {
      // Model attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      sequelize,
      modelName: "TaskAssignee",
      tableName: "TaskAssignee"
    }
  );

  return TaskAssignee;
};
