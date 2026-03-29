const {
  checkAndCreate,
  checkAndUpdateStatus,
  getUsersAndCount,
  checkAndUpdateUser,
} = require('./UserRepository');
const { AccessManagement, User } = require('../index');
const {
  successMessage,
  usersRoles,
  defaultStatus,
  errorMessage,
} = require('../../config/options');
const { Op } = require('sequelize');

const allowedManagedRoles = [
  usersRoles.ADMIN,
  usersRoles.MANAGER,
  usersRoles.EMPLOYEE,
];

const createOrUpdateAccessManagement = async (body, userId) => {
  try {
    let accessManagementData = [];
    if (body.accessManagement && body.accessManagement.length > 0) {
      accessManagementData = await Promise.all(
        body.accessManagement.map(async (iterator) => {
          if (iterator.id) {
            await AccessManagement.update(
              {
                canView: iterator.canView,
                canAdd: iterator.canAdd,
                canEdit: iterator.canEdit,
                canDelete: iterator.canDelete,
              },
              { where: { id: iterator.id } }
            );
            return { ...iterator, id: iterator.id }; // Return updated data
          } else {
            const createdAccess = await AccessManagement.create({
              ...iterator,
              userId,
            });
            return {
              ...iterator,
              id: createdAccess.id,
            }; // Return newly created data
          }
        })
      );
    }
    return accessManagementData; // Return all access management data
  } catch (error) {
    throw new Error(error);
  }
};

const checkAndCreateAdmin = async (body) => {
  body.role = body.role || usersRoles.ADMIN;
  if (!body.countryCode) {
    body.countryCode = '91';
  }
  if (!allowedManagedRoles.includes(body.role)) {
    return {
      success: false,
      message: errorMessage.INVALID_ROLE_SELECTION,
    };
  }
  const newAdmin = await checkAndCreate(body);
  if (!newAdmin.success) {
    return {
      success: false,
      message: newAdmin.message,
    };
  }
  let accessManagement = null;
  if (body.accessManagement) {
    accessManagement = await createOrUpdateAccessManagement(
      body,
      newAdmin.data.id
    );
  }

  // Update the User model with accessManagement IDs
  const accessManagementIds = accessManagement
    ? accessManagement.map((item) => item.id)
    : [];
  const actorCompanyId =
    body.companyId || body.createdByCompanyId || body.currentUserCompanyId || null;
  if (actorCompanyId && !newAdmin.data.companyId) {
    newAdmin.data.companyId = actorCompanyId;
    await newAdmin.data.save();
  }
  await User.update(
    { accessManagement: accessManagementIds },
    { where: { id: newAdmin.data.id } }
  );

  const { id, firstName, lastName, email, mobileNumber, status, createdAt } =
    newAdmin.data;
  const payloadData = {
    id,
    firstName,
    lastName,
    email,
    mobileNumber,
    status,
    createdAt,
    accessManagement: accessManagement,
  };
  const message = successMessage.ADD_SUCCESS_MESSAGE('Admin');
  return {
    success: true,
    data: payloadData,
    message,
  };
};

const checkAndUpdateAdmin = async (body, id) => {
  try {
    const query = {
      where: {
        id,
        role: allowedManagedRoles,
        status: { [Op.ne]: defaultStatus.DELETED },
      },
      attributes: [
        'id',
        'email',
        'mobileNumber',
        'countryCode',
        'status',
        'firstName',
        'lastName',
        'profilePicture',
      ],
      include: [
        {
          model: AccessManagement,
          as: 'accessManagement',
          attributes: [
            'id',
            'category',
            'canView',
            'canAdd',
            'canEdit',
            'canDelete',
          ],
        },
      ],
    };
    const { success, message } = await checkAndUpdateUser(query, body);
    if (!success) {
      return {
        success,
        message,
      };
    }
    const accessManagement = await createOrUpdateAccessManagement(body, id);
    await User.update(
      { accessManagement: accessManagement.map((item) => item.id) },
      { where: { id: id } }
    );
    const data = await User.findOne({
      where: {
        id,
        role: allowedManagedRoles,
        status: { [Op.ne]: defaultStatus.DELETED },
      },
      attributes: [
        'id',
        'email',
        'mobileNumber',
        'countryCode',
        'status',
        'firstName',
        'lastName',
        'profilePicture',
      ],
      include: [
        {
          model: AccessManagement,
          as: 'accessManagement',
          attributes: [
            'id',
            'category',
            'canView',
            'canAdd',
            'canEdit',
            'canDelete',
          ],
        },
      ],
    });

    return {
      success,
      data,
      message,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const getAdminsAndCount = async ({ start, limit, status, search }) => {
  try {
    const data = await getUsersAndCount({
      start,
      limit,
      status,
      search,
      role: allowedManagedRoles,
    });

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const checkAndGetAdmin = async (id) => {
  const existingUser = await User.findOne({
    where: {
      id,
      role: allowedManagedRoles,
      status: { [Op.ne]: defaultStatus.DELETED },
    },
    attributes: [
      'id',
      'email',
      'mobileNumber',
      'countryCode',
      'status',
      'firstName',
      'lastName',
      'profilePicture',
    ],
    include: [
      {
        model: AccessManagement,
        as: 'accessManagement',
        attributes: [
          'id',
          'category',
          'canView',
          'canAdd',
          'canEdit',
          'canDelete',
        ],
      },
    ],
  });
  if (!existingUser) {
    return {
      success: false,
      message: errorMessage.DOES_NOT_EXIST('Admin'),
    };
  }
  return {
    success: true,
    data: existingUser,
    message: successMessage.DETAIL_MESSAGE('Admin profile'),
  };
};

const checkAndPatchAdminStatus = async (id, isDelete) => {
  try {
    const { success, message } = await checkAndUpdateStatus(id, isDelete);
    return {
      success,
      message,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const checkAndPatchAdminStatusByValue = async (id, isActive) => {
  try {
    const existingUser = await User.findOne({
      where: {
        id,
        role: allowedManagedRoles,
        status: { [Op.ne]: defaultStatus.DELETED },
      },
      attributes: ['id', 'status'],
    });

    if (!existingUser) {
      return { success: false, message: errorMessage.DOES_NOT_EXIST('User') };
    }

    existingUser.status = isActive ? defaultStatus.ACTIVE : defaultStatus.BLOCKED;
    await existingUser.save();

    return {
      success: true,
      message: successMessage.CHANGED_SUCCESS_MESSAGE('User status'),
    };
  } catch (error) {
    throw new Error(error);
  }
};

const assignManagerToEmployee = async (employeeId, managerId) => {
  const employee = await User.findOne({
    where: {
      id: employeeId,
      role: usersRoles.EMPLOYEE,
      status: { [Op.ne]: defaultStatus.DELETED },
    },
    attributes: ['id', 'role', 'parentId', 'companyId'],
  });
  if (!employee) {
    return { success: false, message: errorMessage.DOES_NOT_EXIST('Employee') };
  }

  const manager = await User.findOne({
    where: {
      id: managerId,
      role: [usersRoles.MANAGER, usersRoles.ADMIN, usersRoles.SUPER_ADMIN],
      status: { [Op.ne]: defaultStatus.DELETED },
    },
    attributes: ['id', 'role', 'companyId'],
  });
  if (!manager) {
    return { success: false, message: errorMessage.DOES_NOT_EXIST('Manager') };
  }

  if (
    employee.companyId &&
    manager.companyId &&
    Number(employee.companyId) !== Number(manager.companyId)
  ) {
    return { success: false, message: 'Employee and manager must belong to same company' };
  }

  employee.parentId = manager.id;
  await employee.save();
  return {
    success: true,
    message: successMessage.CHANGED_SUCCESS_MESSAGE('Employee manager'),
    data: employee,
  };
};

const getManagerTeam = async (managerId) => {
  const rows = await User.findAll({
    where: {
      parentId: managerId,
      status: { [Op.ne]: defaultStatus.DELETED },
      role: usersRoles.EMPLOYEE,
    },
    attributes: [
      'id',
      'firstName',
      'lastName',
      'email',
      'mobileNumber',
      'status',
      'companyId',
      'parentId',
      'createdAt',
    ],
    order: [['createdAt', 'DESC']],
  });
  return {
    success: true,
    message: successMessage.DETAIL_MESSAGE('Team members'),
    data: rows,
  };
};

module.exports = {
  createOrUpdateAccessManagement,
  checkAndCreateAdmin,
  checkAndUpdateAdmin,
  getAdminsAndCount,
  checkAndGetAdmin,
  checkAndPatchAdminStatus,
  checkAndPatchAdminStatusByValue,
  assignManagerToEmployee,
  getManagerTeam,
};
