const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        Id: { type: DataTypes.STRING, allowNull: false,  primaryKey: true },
        ConcurrencyStamp: { type: DataTypes.STRING, allowNull: false},
        FirstName : { type: DataTypes.STRING, allowNull: false },
        LastName: { type: DataTypes.STRING, allowNull: false },
        UserName: { type: DataTypes.STRING, allowNull: false },
        Email: { type: DataTypes.STRING, allowNull: false },
        PasswordHash: { type: DataTypes.STRING, allowNull: false },
        AccessFailedCount:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        LockoutEnabled: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        EmailConfirmed:{ type: DataTypes.BOOLEAN, allowNull: false,  defaultValue: 0},
        NormalizedEmail: { type: DataTypes.STRING, allowNull: false },
        NormalizedUserName: { type: DataTypes.STRING, allowNull: false },
        PhoneNumber: { type: DataTypes.STRING, allowNull: false },
        PhoneNumberConfirmed: { type: DataTypes.BOOLEAN, allowNull: true,  defaultValue: 0},
        TwoFactorEnabled: { type: DataTypes.BOOLEAN, allowNull: false,  defaultValue: 0},
        IsActive: { type: DataTypes.BOOLEAN, allowNull: true,  defaultValue: 1},
        ProfileImageUrl:   { type: DataTypes.STRING, allowNull: true },
        Rating: {  type: DataTypes.INTEGER, allowNull: true, defaultValue: 0  },
        PaypalEmail: { type: DataTypes.STRING, allowNull: true },
        VenmoPhoneNumber:  { type: DataTypes.STRING, allowNull: true },
        ReferredBy:  { type: DataTypes.STRING, allowNull: true },
        AccountStrikes: {  type: DataTypes.INTEGER, allowNull: true, defaultValue: 0  },
        AccessToken:    { type: DataTypes.STRING, allowNull: true},
        AccessTokenExpiration: {  type: DataTypes.DATE, allowNull: true},
        RefreshToken: { type: DataTypes.STRING, allowNull: true},
        RefreshTokenExpiration: {  type: DataTypes.DATE, allowNull: true},
        TrustapEmail: { type: DataTypes.STRING, allowNull: true },
        UniversityId: { type: DataTypes.INTEGER, allowNull: false,  defaultValue: 1},
        QuickSeller: { type: DataTypes.BOOLEAN, allowNull: true,  defaultValue: 0},
        VerifiedSeller: { type: DataTypes.BOOLEAN, allowNull: true,  defaultValue: 0},
        AgreedToOfflineGrants: { type: DataTypes.BOOLEAN, allowNull: false,  defaultValue: 0},
        GuestTrustapId: { type: DataTypes.STRING, allowNull: true }

    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['PasswordHash','createdAt','updatedAt'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
        
    };

    return sequelize.define('AspNetUsers', attributes,{
        timestamps: false
    }, options);
}