'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.addColumn('User', 'country', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('User', 'currencyCode', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addConstraint('User', {
      fields: ['companyId'],
      type: 'foreign key',
      name: 'user_company_fk',
      references: {
        table: 'Company',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('User', 'user_company_fk');
    await queryInterface.removeColumn('User', 'currencyCode');
    await queryInterface.removeColumn('User', 'country');
  },
};
