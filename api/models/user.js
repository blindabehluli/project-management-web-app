'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    class User extends Model {

        // Model association are defined here

        static associate(models) {
            User.hasMany(models.UserWorkspace, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "userId",
                    allowNull: false,
                },
                onDelete: 'CASCADE'
            });

            User.hasMany(models.UserBoard, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "userId",
                    allowNull: false,
                },
                onDelete: 'CASCADE'
            });

            User.hasMany(models.UserTask, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "userId",
                    allowNull: false,
                },
                onDelete: 'CASCADE'
            });

            User.hasMany(models.Workspace, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "userId",
                    allowNull: false,
                },
                onDelete: 'CASCADE'
            });
            
            User.belongsToMany(models.Workspace, {
                through: models.UserWorkspace,
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "userId",
                    allowNull: false,
                },
                otherKey: 'workspaceId',
            });

            User.belongsToMany(models.Board, {
                through: models.UserBoard,
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "userId",
                    allowNull: false,
                },
                otherKey: 'boardId',
            });
        }
    }

    // Model attributes are defined here

    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name is required.'
                },
                notEmpty: {
                    msg: 'Please provide the first name.'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Last name is required.'
                },
                notEmpty: {
                    msg: 'Please provide the last name.'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'The email you entered already exists.'
            },
            validate: {
                notNull: {
                    msg: 'An email is required.'
                },
                isEmail: {
                    msg: 'Please provide a valid email address.'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('password', hashedPassword);
            },
            validate: {
                notNull: {
                    msg: 'A password is required'
                },
                notEmpty: {
                    msg: 'Please provide a password'
                }
            }
        },
        profileColor: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "#f1f2f3"
        }
    }, {
        sequelize, // We need to pass the connection instance
        modelName: 'User' // We need to choose the model name
    });

    return User;
}