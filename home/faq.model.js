const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        Id: { type: DataTypes.STRING, allowNull: false,  primaryKey: true },
        Question: { type: DataTypes.TEXT, allowNull: false},
        Answer: { type: DataTypes.TEXT, allowNull: false},
        Type: { type: DataTypes.STRING, allowNull: false},

    };

    return sequelize.define('Faqs', attributes,{
        timestamps: false
    });
}