const { Op } = require('sequelize');
const OPTIONS = require('../config/options');

module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define(
    'Expense',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: OPTIONS.defaultStatus.PENDING,
      },
      approvalStep: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      approvedByRole: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rejectedReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      receiptUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ocrExtractedData: {
        type: DataTypes.JSONB,
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

  Expense.associate = (models) => {
    Expense.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Expense.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company',
    });
    Expense.hasMany(models.ExpenseApproval, {
      foreignKey: 'expenseId',
      as: 'approvalHistory',
    });
  };

  return Expense;
};
