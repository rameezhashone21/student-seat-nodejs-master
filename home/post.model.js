const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        Id: { type: DataTypes.STRING, allowNull: false,  primaryKey: true },
        SoftDeleted: { type: DataTypes.STRING, allowNull: false},
        ListingFrozen: { type: DataTypes.STRING, allowNull: false},
        ForumId: { type: DataTypes.STRING, allowNull: false},
        Price: { type: DataTypes.STRING, allowNull: false},

    };

    return sequelize.define('Posts', attributes,{
        timestamps: false
    });
}