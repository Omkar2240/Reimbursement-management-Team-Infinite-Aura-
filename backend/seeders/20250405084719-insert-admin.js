'use strict';

const { usersRoles, defaultStatus } = require('../config/options');
const { generatePassword } = require('../models/helpers/UtilHelper');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const email = 'superadmin@flowexpense.com';
      const password = 'code@2025';

      const passwordHash = await generatePassword(password);
      await queryInterface.bulkInsert('User', [
        {
          userName: 'superadmin',
          email,
          password: passwordHash,
          role: usersRoles.SUPER_ADMIN,
          firstName: 'Super',
          lastName: 'Admin',
          countryCode: '91',
          mobileNumber: '9999999999',
          status: defaultStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error inserting super admin:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    const email = 'superadmin@flowexpense.com';
    await queryInterface.bulkDelete('User', {
      email,
      role: usersRoles.SUPER_ADMIN,
    });
  },
};
