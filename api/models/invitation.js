const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Invitation extends Model {
    static associate(models) {
      Invitation.belongsTo(models.User, {
        foreignKey: {
          fieldName: "inviterUserId",
          allowNull: false,
        },
        as: "inviter",
      });
      Invitation.belongsTo(models.User, {
        foreignKey: {
          fieldName: "inviteeUserId",
          allowNull: false,
        },
        as: "invitee",
      });
      Invitation.belongsTo(models.Workspace, {
        foreignKey: {
          fieldName: "workspaceId",
          allowNull: false,
        },
      });
    }
  }

  Invitation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "member"),
        allowNull: false,
        defaultValue: "member",
        validate: {
          isIn: [["admin", "member"]],
        },
      },
      inviterUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      inviteeUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      workspaceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Invitation",
      tableName: "Invitation",
      timestamps: true,
    }
  );

  return Invitation;
};