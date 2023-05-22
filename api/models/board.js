const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Board extends Model {
    static associate(models) {
      // Model associations are defined here

      Board.hasMany(models.Column, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "boardId",
          allowNull: false,
        },
      });
      Board.hasOne(models.BoardImage, {
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
      // Model attributes
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
      tableName: "Board",
      hooks: {
        // This hook is executed after a new Board is created and saved to the database
        async afterCreate(board, options) {
          // Create a BoardImage instance with a default image url
          await sequelize.models.BoardImage.create(
            {
              boardId: board.id,
              boardImageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTA0MDh8MHwxfHNlYXJjaHw0fHx3YXRlcnxlbnwwfHx8fDE2ODQ0OTE3NTd8MA&ixlib=rb-4.0.3&q=80&w=1080",
            },
            { transaction: options.transaction }
          );
        },

        // This hook is executed before a Board is destroyed/deleted from the database
        async beforeDestroy(board, options) {
          // Delete the associated BoardImage instance
          await sequelize.models.BoardImage.destroy({
            where: {
              boardId: board.id,
            },
            transaction: options.transaction,
          });
        },
      },
    }
  );

  return Board;
};