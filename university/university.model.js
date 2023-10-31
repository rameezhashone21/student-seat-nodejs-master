const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        Id: { type: DataTypes.STRING, allowNull: false,  primaryKey: true },
        Name: { type: DataTypes.STRING, allowNull: false},
        GameName: { type: DataTypes.STRING, allowNull: false},
        ImageUrl: {type: DataTypes.STRING, allowNull: false},
        SeoName: { type: DataTypes.STRING, allowNull: false},
    };

    return sequelize.define('Universities', attributes,{
        timestamps: false
    });
}