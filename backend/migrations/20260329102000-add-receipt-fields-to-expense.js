'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.addColumn('Expense', 'receiptUrl', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Expense', 'ocrExtractedData', {
      type: DataTypes.JSONB,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Expense', 'ocrExtractedData');
    await queryInterface.removeColumn('Expense', 'receiptUrl');
  },
};
