const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Comment extends Model {
        static associate(models) {

            // Model association are defined here

            Comment.belongsTo(models.Task, {
                foreignKey: {
                    type: DataTypes.INTEGER,
                    fieldName: "taskId",
                    allowNull: false,
                },
            });
        }
    }

    Comment.init({
        // model attributes
    }, {
        sequelize,
        modelName: 'Comment',
    });

    return Comment;
};
