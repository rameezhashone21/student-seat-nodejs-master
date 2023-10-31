const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        Id: { type: DataTypes.STRING, allowNull: false,  primaryKey: true },
        Title: { type: DataTypes.STRING, allowNull: false},
        CoverImageUrl: { type: DataTypes.STRING, allowNull: false},
        Sport: { type: DataTypes.STRING, allowNull: false},
        SeatingAssignment: { type: DataTypes.STRING, allowNull: false},
        CloseTime: { type: DataTypes.STRING, allowNull: false},

    };

    return sequelize.define('Forums', attributes,{
        timestamps: false
    });
}