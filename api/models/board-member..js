"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class BoardMember extends Model {
    // Model association are defined here

    static associate(models) {
      BoardMember.belongsTo(models.User, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "userId",
          allowNull: false,
        },
      });
      BoardMember.belongsTo(models.Board, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "boardId",
          allowNull: false,
        },
      });
    }
  }

  BoardMember.init(
    {
      // Model attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "member"),
        allowNull: false,
        defaultValue: "member",
        validate: {
          isIn: [["admin", "member"]],
        },
      },
    },
    {
      sequelize,
      modelName: "BoardMember",
      tableName: "BoardMember"
    }
  );

  return BoardMember;
};
