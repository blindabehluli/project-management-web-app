const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Column extends Model {
    static associate(models) {
      // Model association are defined here

      Column.hasMany(models.Task, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "columnId",
          allowNull: false,
        },
      });
      Column.belongsTo(models.Board, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "boardId",
          allowNull: false,
        },
      });
    }
  }

  Column.init(
    {
      // model attributes
      columnStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Column status is required.",
          },
          notEmpty: {
            msg: "Please provide the column status e.g To-do, Doing, Done.",
          },
        },
      },
      columnStatusColor: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
            msg: "Please provide a valid hex color code for the column label.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Column",
    }
  );

  return Column;
};
