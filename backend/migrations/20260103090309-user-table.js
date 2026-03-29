'use strict';
const OPTIONS = require('../config/options');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      userName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      dob: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      role: {
        type: DataTypes.ENUM(OPTIONS.usersRoles.getAllRolesAsArray()),
        allowNull: false,
      },
      countryCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mobileNumber: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      tempOtp: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      tempOtpExpiresAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      lastSignInAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: OPTIONS.defaultStatus.ACTIVE,
      },
      profilePicture: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    });

    // Add index for email
    await queryInterface.addIndex('User', ['email'], {
      name: 'user_email_index',
    });
    await queryInterface.addIndex('User', ['companyId'], {
      name: 'user_company_id_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
  },
};
