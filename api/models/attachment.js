const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Attachment extends Model {
    static associate(models) {
      // Model association are defined here

      Attachment.belongsTo(models.Task, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "taskId",
          allowNull: false,
        },
      });
    }
  }

  Attachment.init(
    {
      // model attributes
      attachmentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Attachment",
      tableName: "Attachment"
    }
  );

  return Attachment;
};
