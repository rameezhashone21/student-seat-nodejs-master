const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        Id: { type: DataTypes.STRING, allowNull: false,  primaryKey: true },
        review: { type: DataTypes.TEXT, allowNull: false},
    };

    return sequelize.define('Reviews', attributes,{
        timestamps: false
    });
}