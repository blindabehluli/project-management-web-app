const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class BoardImage extends Model {
    static associate(models) {
      // Model association are defined here

      BoardImage.belongsTo(models.Board, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "boardId",
          allowNull: false,
        },
      });
    }
  }

  BoardImage.init(
    {
      // model attributes
      boardImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      sequelize,
      modelName: "BoardImage",
      tableName: "BoardImage"
    }
  );

  return BoardImage;
};
