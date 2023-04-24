const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Board extends Model {
    static associate(models) {
      // Model association are defined here

      Board.hasMany(models.Invitation, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "boardId",
          allowNull: false,
        },
      });
      Board.hasMany(models.Column, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "boardId",
          allowNull: false,
        },
      });
      Board.hasMany(models.BoardImage, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "boardId",
          allowNull: false,
        },
      });
      Board.belongsTo(models.Workspace, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "workspaceId",
          allowNull: false,
        },
      });
    }
  }

  Board.init(
    {
      // model attributes
      boardTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Board title is required.",
          },
          notEmpty: {
            msg: "Please provide the Board title.",
          },
        },
      },
      boardDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Board description is required.",
          },
          notEmpty: {
            msg: "Please provide the Board description.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Board",
      tableName: "Board"
    }
  );

  return Board;
};
