const { Op } = require('sequelize');
const OPTIONS = require('../config/options');

module.exports = (sequelize, DataTypes) => {
  const ApprovalRule = sequelize.define(
    'ApprovalRule',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stepNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      approverRole: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      approverUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isManagerApprover: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      percentageThreshold: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      allowCfoShortcut: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: OPTIONS.defaultStatus.ACTIVE,
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

  ApprovalRule.associate = (models) => {
    ApprovalRule.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company',
    });
    ApprovalRule.belongsTo(models.User, {
      foreignKey: 'approverUserId',
      as: 'approverUser',
    });
    ApprovalRule.hasMany(models.ExpenseApproval, {
      foreignKey: 'ruleId',
      as: 'approvals',
    });
  };

  return ApprovalRule;
};
