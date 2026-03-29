const { Op } = require('sequelize');
const OPTIONS = require('../config/options');

module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    'Company',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currencyCode: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: process.env.DEFAULT_CURRENCY_CODE || 'USD',
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: OPTIONS.defaultStatus.ACTIVE,
      },
      adminUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      defaultScope: {
        where: {
          status: { [Op.ne]: OPTIONS.defaultStatus.DELETED },
        },
      },
    }
  );

  Company.associate = (models) => {
    Company.hasMany(models.User, {
      foreignKey: 'companyId',
      as: 'users',
    });
    Company.hasMany(models.Expense, {
      foreignKey: 'companyId',
      as: 'expenses',
    });
    Company.hasMany(models.ApprovalRule, {
      foreignKey: 'companyId',
      as: 'approvalRules',
    });
  };

  return Company;
};
