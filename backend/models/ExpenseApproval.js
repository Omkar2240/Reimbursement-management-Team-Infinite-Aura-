const { Op } = require('sequelize');
const OPTIONS = require('../config/options');

module.exports = (sequelize, DataTypes) => {
  const ExpenseApproval = sequelize.define(
    'ExpenseApproval',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      expenseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ruleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      approverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      statusFlag: {
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
          statusFlag: { [Op.ne]: OPTIONS.defaultStatus.DELETED },
        },
      },
    }
  );

  ExpenseApproval.associate = (models) => {
    ExpenseApproval.belongsTo(models.Expense, {
      foreignKey: 'expenseId',
      as: 'expense',
    });
    ExpenseApproval.belongsTo(models.User, {
      foreignKey: 'approverId',
      as: 'approver',
    });
    ExpenseApproval.belongsTo(models.ApprovalRule, {
      foreignKey: 'ruleId',
      as: 'rule',
    });
  };

  return ExpenseApproval;
};
