const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const OPTIONS = require('../config/options');
const jwtOPTIONS = require('../config/jwtOptions');
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
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
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      profilePicture: {
        allowNull: true,
        type: DataTypes.TEXT,
        get() {
          return OPTIONS.generateCloudFrontUrl(
            this.getDataValue('profilePicture')
          );
        },
        set(file) {
          if (file) {
            this.setDataValue(
              'profilePicture',
              `uploads/${file.split('uploads/')[1]}`
            );
          }
        },
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currencyCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
      defaultScope: {
        where: {
          // Status is NOT EQUAL (!=) to 'deleted'
          status: { [Op.ne]: OPTIONS.defaultStatus.DELETED },
        },
      },
      indexes: [
        {
          fields: ['email'],
        },
      ],
    }
  );

  User.prototype.genToken = function (sessionId = null) {
    const payload = {
      id: this.id,
      email: this.email,
      role: this.role,
    };
    if (sessionId) {
      payload.sessionId = sessionId;
    }
    return jwt.sign(payload, jwtOPTIONS.secretOrKey, {
      expiresIn: jwtOPTIONS.expiry,
    });
  };

  User.prototype.validPassword = function (password) {
    return this.password ? bcrypt.compareSync(password, this.password) : false;
  };

  User.associate = (models) => {
    User.hasMany(models.AccessManagement, {
      foreignKey: 'userId',
      as: 'accessManagement',
    });

    User.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company',
    });

    // No student-related associations in company/employee domain
  };

  return User;
};
