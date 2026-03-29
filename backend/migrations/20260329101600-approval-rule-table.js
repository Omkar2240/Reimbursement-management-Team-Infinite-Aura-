'use strict';

const OPTIONS = require('../config/options');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('ApprovalRule', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Company',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
        references: {
          model: 'User',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });

    await queryInterface.addIndex('ApprovalRule', ['companyId'], {
      name: 'approval_rule_company_id_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ApprovalRule');
  },
};
