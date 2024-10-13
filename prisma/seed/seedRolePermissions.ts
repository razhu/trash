/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { PermissionType } from '@prisma/client';
import { PrismaService } from '../../src/modules/prisma';
import { permissionCategories } from '../constants';
import { Permission, PermissionCategory, UserRole } from '../../src/enums';

export const seedRolePermissions = async (prisma: PrismaService) => {
  // Helper to create categories
  const upsertedPermissionCategories = await Promise.all(
    permissionCategories.map((category) =>
      prisma.permissionCategory
        .upsert({
          where: { name: category.name },
          update: {},
          create: { ...category, created_by: null, modified_by: null },
        })
        .catch((error) => {
          console.error(`Error creating category ${category.name}:`, error);
          return null; // Return null in case of an error
        }),
    ),
  );

  // Helper to create permissions by category and platform type
  const createPermissions = async (
    categoryName: string,
    permissions: {
      name: string;
      permission_type: PermissionType;
      description?: string;
    }[],
  ) => {
    const category = upsertedPermissionCategories.find(
      (c) => c.name === categoryName,
    );
    return Promise.all(
      permissions.map((permission) =>
        prisma.permission
          .upsert({
            where: {
              permission_name_permission_type: {
                permission_name: permission.name,
                permission_type: permission.permission_type,
              },
            },
            update: {},
            create: {
              permission_name: permission.name,
              permission_type: permission.permission_type,
              category_id: category?.id,
              description: permission.description,
              //TODO: Needs to be non-nullable. System user discussion pending to make this change.
              created_by: null,
              modified_by: null,
            },
          })
          .catch((error) => {
            console.error(
              `Error creating permission ${permission.name}:`,
              error,
            );
            return null; // Return null in case of an error
          }),
      ),
    );
  };

  // permissions block
  const deviceManagementPermissionsDesktop = await createPermissions(
    PermissionCategory.DEVICE_MANAGEMENT,
    [
      {
        name: Permission.REMOVE_DEVICE_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.READ_DEVICE_DATA_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.CONTROL_DEVICE_DESKTOP,
        permission_type: PermissionType.DESKTOP,
        description: `Device control includes single-device control and batch control. No acocunt hierarchy for device control, meaning that property manager's device operation can overwrite pando admins opertions.`,
      },
      {
        name: Permission.EDIT_DEVICE_INFO_DESKTOP,
        permission_type: PermissionType.DESKTOP,
        description: `Device information includes, device name, device location, parking lot number, circuit breaker number, etc`,
      },
      {
        name: Permission.FIRMWARE_UPLOAD_DESKTOP,
        permission_type: PermissionType.DESKTOP,
        description: `Only Pando admin account can upload the new firmware to the cloud, and decide which device is gonna be updated.`,
      },
    ],
  );

  const deviceManagementPermissionsApp = await createPermissions(
    PermissionCategory.DEVICE_MANAGEMENT,
    [
      {
        name: Permission.ADD_REMOVE_DEVICE_APP,
        permission_type: PermissionType.APP,
      },
      {
        name: Permission.READ_DEVICE_DATA_APP,
        permission_type: PermissionType.APP,
      },
      {
        name: Permission.CONTROL_DEVICE_APP,
        permission_type: PermissionType.APP,
        description: `Device control includes single-device control and batch control. No acocunt hierarchy for device control, meaning that property manager's device operation can overwrite pando admins opertions.`,
      },
      {
        name: Permission.EDIT_DEVICE_INFO_APP,
        permission_type: PermissionType.APP,
        description: `Device information includes, device name, device location, parking lot number, circuit breaker number, etc`,
      },
    ],
  );

  const deviceUserPermissionsDesktop = await createPermissions(
    PermissionCategory.DEVICE_USER,
    [
      {
        name: Permission.ADD_REMOVE_DEVICE_USER_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.EDIT_DEVICE_USER_INFO_DESKTOP,
        permission_type: PermissionType.DESKTOP,
        description: `Device user info includes all information from registration form`,
      },
      {
        name: Permission.AUTHORIZE_DEVICE_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      { name: 'De-authorize Device', permission_type: PermissionType.DESKTOP },
      {
        name: Permission.EXPORT_USER_SESSION_DATA_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.READ_DEVICE_USER_USAGE_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
    ],
  );

  const notificationPermissionsDesktop = await createPermissions(
    PermissionCategory.NOTIFICATION,
    [
      {
        name: Permission.EDIT_WARNING_THRESHOLD_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.WARNING_INFORMATION_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.WARNING_MANAGEMENT_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.LOAD_RULES_SETTING_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.LOAD_THRESHOLD_SETTING_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
    ],
  );

  const notificationPermissionsApp = await createPermissions(
    PermissionCategory.NOTIFICATION,
    [
      {
        name: Permission.EDIT_WARNING_THRESHOLD_APP,
        permission_type: PermissionType.APP,
      },
      {
        name: Permission.WARNING_INFORMATION_APP,
        permission_type: PermissionType.APP,
      },
      {
        name: Permission.WARNING_MANAGEMENT_APP,
        permission_type: PermissionType.APP,
      },
      {
        name: Permission.LOAD_RULES_SETTING_APP,
        permission_type: PermissionType.APP,
      },
      {
        name: Permission.LOAD_THRESHOLD_SETTING_APP,
        permission_type: PermissionType.APP,
      },
    ],
  );

  const serviceAccountPermissionsDesktop = await createPermissions(
    PermissionCategory.SERVICE_ACCOUNT,
    [
      {
        name: Permission.EDIT_SERVICE_ACCOUNT_INFO_DESKTOP,
        permission_type: PermissionType.DESKTOP,
        description: `Service account information includes service account #, property location, term period for Gen 2.0`,
      },
      {
        name: Permission.CREATE_SERVICE_ACCOUNT_USER_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.EDIT_SERVICE_ACCOUNT_USER_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.DELETE_SERVICE_ACCOUNT_USER_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.RESET_SERVICE_ACCOUNT_USER_PASSWORD_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.MANAGE_ROLE_PERMISSIONS_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
    ],
  );

  const priceManagementPermissionsDesktop = await createPermissions(
    PermissionCategory.PRICE_MANAGEMENT,
    [
      {
        name: Permission.EDIT_BASE_RATE_CREDIT_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.TIME_OF_USE_RATE_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
      {
        name: Permission.PRICE_BASED_ON_USER_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
    ],
  );

  const financialPermissionsDesktop = await createPermissions(
    PermissionCategory.FINANCIAL,
    [
      {
        name: Permission.READ_FINANCIAL_STATS_DESKTOP,
        permission_type: PermissionType.DESKTOP,
      },
    ],
  );

  const usageStatsPermissionsApp = await createPermissions(
    PermissionCategory.USAGE_STATS,
    [
      {
        name: Permission.READ_USAGE_HISTORY_APP,
        permission_type: PermissionType.APP,
      },
    ],
  );

  const paymentPermissionsApp = await createPermissions(
    PermissionCategory.PAYMENT,
    [
      {
        name: Permission.EDIT_PAYMENT_METHOD_APP,
        permission_type: PermissionType.APP,
      },
      {
        name: Permission.REVIEW_RECEIPT_HISTORY_APP,
        permission_type: PermissionType.APP,
      },
    ],
  );

  // Create Roles
  const roles = [
    {
      role_name: UserRole.PANDO_ADMIN,
      description: 'Full access to the system',
    },
    {
      role_name: UserRole.PROPERTY_MANAGER,
      description: 'Access to property management features',
    },
    {
      role_name: UserRole.INSTALLER,
      description: 'Access to installation related features',
    },
    {
      role_name: UserRole.MAINTAINER,
      description: 'Access to maintenance features',
    },
    {
      role_name: UserRole.EV_DRIVER,
      description: 'Limited access for EV drivers',
    },
  ];

  const createdRoles = await Promise.all(
    roles.map((role) =>
      prisma.role
        .upsert({
          where: { role_name: role.role_name },
          update: {},
          create: { ...role, created_by: null, modified_by: null },
        })
        .catch((error) => {
          console.error(`Error creating role ${role.role_name}:`, error);
          return null; // Return null in case of an error
        }),
    ),
  );

  // Helper to assign permissions to roles
  const assignPermissionsToRole = async (
    roleName: string,
    permissions: any[],
  ) => {
    const role = createdRoles.find((r) => r.role_name === roleName);
    return Promise.all(
      permissions.map((permission) =>
        prisma.rolePermission
          .upsert({
            where: {
              role_id_permission_id: {
                role_id: role?.id,
                permission_id: permission.id,
              },
            },
            update: {},
            create: {
              role_id: role?.id,
              permission_id: permission.id,
              created_by: null,
              modified_by: null,
            },
          })
          .catch((error) => {
            console.error(
              `Error assigning permission to role ${permission.permission_name} to role ${roleName}:`,
              error,
            );
            return null; // Return null in case of an error
          }),
      ),
    );
  };

  // Assign Permissions to Roles based on matrix
  await assignPermissionsToRole(UserRole.PANDO_ADMIN, [
    ...deviceManagementPermissionsDesktop,
    ...deviceManagementPermissionsApp,
    ...deviceUserPermissionsDesktop,
    ...notificationPermissionsDesktop,
    ...notificationPermissionsApp,
    ...serviceAccountPermissionsDesktop,
    ...priceManagementPermissionsDesktop,
    ...financialPermissionsDesktop,
    ...usageStatsPermissionsApp,
  ]);

  await assignPermissionsToRole(UserRole.PROPERTY_MANAGER, [
    ...deviceManagementPermissionsDesktop.filter((p) =>
      [
        Permission.REMOVE_DEVICE_DESKTOP,
        Permission.READ_DEVICE_DATA_DESKTOP,
        Permission.CONTROL_DEVICE_DESKTOP,
      ].includes(p.permission_name),
    ),
    ...deviceManagementPermissionsApp.filter((p) =>
      [
        Permission.ADD_REMOVE_DEVICE_APP,
        Permission.READ_DEVICE_DATA_APP,
        Permission.CONTROL_DEVICE_APP,
      ].includes(p.permission_name),
    ),
    ...deviceUserPermissionsDesktop.filter(
      (p) =>
        ![Permission.EXPORT_USER_SESSION_DATA_DESKTOP].includes(
          p.permission_name,
        ),
    ),
    ...notificationPermissionsDesktop,
    ...notificationPermissionsApp,
    ...serviceAccountPermissionsDesktop.filter((p) =>
      [
        Permission.EDIT_SERVICE_ACCOUNT_USER_DESKTOP,
        Permission.DELETE_SERVICE_ACCOUNT_USER_DESKTOP,
        Permission.RESET_SERVICE_ACCOUNT_USER_PASSWORD_DESKTOP,
      ].includes(p.permission_name),
    ),
    ...priceManagementPermissionsDesktop,
    ...financialPermissionsDesktop,
    ...usageStatsPermissionsApp,
  ]);

  await assignPermissionsToRole(UserRole.INSTALLER, [
    ...deviceManagementPermissionsDesktop.filter(
      (p) => ![Permission.FIRMWARE_UPLOAD_DESKTOP].includes(p.permission_name),
    ),
    ...deviceManagementPermissionsApp,
    ...notificationPermissionsDesktop,
    ...notificationPermissionsApp,
  ]);
  await assignPermissionsToRole(UserRole.MAINTAINER, [
    ...deviceManagementPermissionsDesktop.filter((p) =>
      [
        Permission.READ_DEVICE_DATA_DESKTOP,
        Permission.CONTROL_DEVICE_DESKTOP,
      ].includes(p.permission_name),
    ),
    ...deviceManagementPermissionsApp.filter((p) =>
      [Permission.READ_DEVICE_DATA_APP, Permission.CONTROL_DEVICE_APP].includes(
        p.permission_name,
      ),
    ),
    ...notificationPermissionsDesktop,
    ...notificationPermissionsApp,
  ]);

  await assignPermissionsToRole(UserRole.EV_DRIVER, [
    ...deviceManagementPermissionsApp.filter((p) =>
      [Permission.CONTROL_DEVICE_APP].includes(p.permission_name),
    ),
    ...usageStatsPermissionsApp,
    ...paymentPermissionsApp,
  ]);

  console.log('Roles and permissions seed data upserted');
};
