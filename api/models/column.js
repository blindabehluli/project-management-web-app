const { Model, DataTypes } = require('sequelize');

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

    Column.init({
        // model attributes
    }, {
        sequelize,
        modelName: 'Column',
    });

    return Column;
};
