"use strict";

const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  class User extends Model {
    // Model association are defined here

    static associate(models) {
      User.hasMany(models.Invitation, {
        as: "sentInvitations",
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "inviterUserId",
          allowNull: false,
        },
      });
      
      User.hasMany(models.Invitation, {
        as: "receivedInvitations",
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "inviteeUserId",
          allowNull: false,
        },
      });
      
      User.hasMany(models.Workspace, {
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "userId",
          allowNull: false,
        },
      });

      User.belongsToMany(models.Workspace, {
        through: models.WorkspaceMember,
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "userId",
          allowNull: false,
        },
        otherKey: "workspaceId",
      });

      User.belongsToMany(models.Task, {
        through: models.TaskAssignee,
        foreignKey: {
          type: DataTypes.INTEGER,
          fieldName: "userId",
          allowNull: false,
        },
        otherKey: "taskId",
      });
    }
  }

  // Model attributes are defined here

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "First name is required.",
          },
          notEmpty: {
            msg: "Please provide the first name.",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Last name is required.",
          },
          notEmpty: {
            msg: "Please provide the last name.",
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "The email you entered already exists.",
        },
        validate: {
          notNull: {
            msg: "An email is required.",
          },
          isEmail: {
            msg: "Please provide a valid email address.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required.",
          },
          notEmpty: {
            msg: "Please provide a password.",
          },
        },
      },
      profileColor: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "#fff",
        validate: {
          is: {
            args: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
            msg: "Please provide a valid hex color code for the column label.",
          },
        },
      },
    },
    {
      sequelize, // We need to pass the connection instance
      modelName: "User", // We can choose the model name
      tableName: "User", // We can choose the table name
      hooks: {
        // This hook is executed after a new User is created and saved to the database
        async afterCreate(user, options) {
          // Create a Workspace instance by default when a user is created
          await sequelize.models.Workspace.create({
            userId: user.id,
            workspaceTitle: 'My workspace',
            workspaceDescription: 'This is my workspace description',
          }, { transaction: options.transaction });
        },
      },
    }
  );

  User.afterValidate((user) => {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    user.password = hashedPassword;
  });

  return User;
};
