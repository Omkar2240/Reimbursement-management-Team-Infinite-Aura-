'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.addColumn('Expense', 'companyId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Company',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Expense', 'companyId');
  },
};
