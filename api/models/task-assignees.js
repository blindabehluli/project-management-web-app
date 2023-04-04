"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class TaskAssignees extends Model {
    static associate(models) {
      // Model association are defined here

      TaskAssignees.belongsTo(models.User, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "userId",
          allowNull: false,
        },
      });
      TaskAssignees.belongsTo(models.Task, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "taskId",
          allowNull: false,
        },
      });
    }
  }

  TaskAssignees.init(
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
      modelName: "TaskAssignees",
    }
  );

  return TaskAssignees;
};
