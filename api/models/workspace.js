const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Workspace extends Model {
    static associate(models) {
      // Model association are defined here
      Workspace.hasMany(models.Board, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "workspaceId",
          allowNull: false,
        },
      });
      Workspace.belongsToMany(models.User, {
        through: models.WorkspaceMember,
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "workspaceId",
          allowNull: false,
        },
        otherKey: "userId",
      });

      Workspace.belongsTo(models.User, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "userId",
          allowNull: false,
        },
      });
    }
  }

  Workspace.init(
    {
      // model attributes
      workspaceTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Workspace title is required.",
          },
          notEmpty: {
            msg: "Please provide the workspace title.",
          },
        },
      },
      workspaceDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Workspace description is required.",
          },
          notEmpty: {
            msg: "Please provide the workspace description.",
          },
        },
      },
      workspaceLogoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        isUrl: true
      },
      
      
    },
    {
      sequelize,
      modelName: "Workspace",
      tableName: "Workspace",
      hooks: {
        // This hook is executed after a new Workspace is created and saved to the database
        async afterCreate(workspace, options) {
          // Create a WorkspaceMember instance with the role of 'default'
          await sequelize.models.WorkspaceMember.create(
            {
              userId: workspace.userId,
              workspaceId: workspace.id,
              role: "admin",
            },
            { transaction: options.transaction }
          );
        },
      },
    }
  );

  return Workspace;
};
