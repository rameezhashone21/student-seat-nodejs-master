const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        Id: { type: DataTypes.STRING, allowNull: false,  primaryKey: true },
        ForumId: { type: DataTypes.STRING, allowNull: false},
        Status: { type: DataTypes.STRING, allowNull: false},
        Price: { type: DataTypes.STRING, allowNull: false},

    };

    return sequelize.define('TrustapTransactions', attributes,{
        timestamps: false
    });
}