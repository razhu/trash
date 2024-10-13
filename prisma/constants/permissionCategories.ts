import { PermissionCategory } from '../../src/enums';

export const permissionCategories = [
  {
    name: PermissionCategory.DEVICE_MANAGEMENT,
    description: 'Device management related permissions',
  },
  {
    name: PermissionCategory.DEVICE_USER,
    description: 'Device user management permissions',
  },
  {
    name: PermissionCategory.NOTIFICATION,
    description: 'Notification management permissions',
  },
  {
    name: PermissionCategory.SERVICE_ACCOUNT,
    description: 'Service account management permissions',
  },
  {
    name: PermissionCategory.PRICE_MANAGEMENT,
    description: 'Price management permissions',
  },
  {
    name: PermissionCategory.FINANCIAL,
    description: 'Financial stats management permissions',
  },
  {
    name: PermissionCategory.USAGE_STATS,
    description: 'Usage statistics management permissions',
  },
  {
    name: PermissionCategory.PAYMENT,
    description: 'Payment management permissions',
  },
];
