// models/accessManagement.js

module.exports = (sequelize, DataTypes) => {
  const AccessManagement = sequelize.define(
    'AccessManagement',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      canView: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      canAdd: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      canEdit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      canDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
    },
    {
      tableName: 'AccessManagement',
      timestamps: true,
    }
  );

  AccessManagement.associate = (models) => {
    AccessManagement.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return AccessManagement;
};
