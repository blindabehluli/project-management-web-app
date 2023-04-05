"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class WorkspaceMember extends Model {
    static associate(models) {
      // Model association are defined here

      WorkspaceMember.belongsTo(models.User, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "userId",
          allowNull: false,
        },
      });
      WorkspaceMember.belongsTo(models.Workspace, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "workspaceId",
          allowNull: false,
        },
      });
    }
  }

  WorkspaceMember.init(
    {
      // Model attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "viewer", "editor"),
        allowNull: false,
        defaultValue: "viewer",
        validate: {
          isIn: [["admin", "viewer", "editor"]],
        },
      },
    },
    {
      sequelize,
      modelName: "WorkspaceMember",
      tableName: "WorkspaceMember"
    }
  );

  return WorkspaceMember;
};