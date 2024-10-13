/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

export enum Permission {
  // Device Management - Desktop
  REMOVE_DEVICE_DESKTOP = 'Remove Device',
  READ_DEVICE_DATA_DESKTOP = 'Read Device data/log',
  CONTROL_DEVICE_DESKTOP = 'Control Device (Single device / Batch)',
  EDIT_DEVICE_INFO_DESKTOP = 'Edit Device Information',
  FIRMWARE_UPLOAD_DESKTOP = 'Firmware Upload / Update',

  // Device Management - App
  ADD_REMOVE_DEVICE_APP = 'Add & Remove Device',
  READ_DEVICE_DATA_APP = 'Read Device data/log via App',
  CONTROL_DEVICE_APP = 'Control Device (Single device / Batch)',
  EDIT_DEVICE_INFO_APP = 'Edit Device Information',

  // Device User - Desktop
  ADD_REMOVE_DEVICE_USER_DESKTOP = 'Add/Remove Device User',
  EDIT_DEVICE_USER_INFO_DESKTOP = 'Edit Device User Info',
  AUTHORIZE_DEVICE_DESKTOP = 'Authorize Device',
  DEAUTHORIZE_DEVICE_DESKTOP = 'De-authorize Device',
  EXPORT_USER_SESSION_DATA_DESKTOP = 'Export User charging session data',
  READ_DEVICE_USER_USAGE_DESKTOP = 'Read Device User Usage',

  // Notification - Desktop
  EDIT_WARNING_THRESHOLD_DESKTOP = 'Edit Warning Threshold',
  WARNING_INFORMATION_DESKTOP = 'Warning Information',
  WARNING_MANAGEMENT_DESKTOP = 'Warning Management',
  LOAD_RULES_SETTING_DESKTOP = 'Load Rules Setting',
  LOAD_THRESHOLD_SETTING_DESKTOP = 'Load Threshold Setting',

  // Notification - App
  EDIT_WARNING_THRESHOLD_APP = 'Edit Warning Threshold',
  WARNING_INFORMATION_APP = 'Warning Information',
  WARNING_MANAGEMENT_APP = 'Warning Management',
  LOAD_RULES_SETTING_APP = 'Load Rules Setting',
  LOAD_THRESHOLD_SETTING_APP = 'Load Threshold Setting',

  // Service Account - Desktop
  EDIT_SERVICE_ACCOUNT_INFO_DESKTOP = 'Edit service account info',
  CREATE_SERVICE_ACCOUNT_USER_DESKTOP = 'Create Service Account User',
  EDIT_SERVICE_ACCOUNT_USER_DESKTOP = 'Edit Service Account User',
  DELETE_SERVICE_ACCOUNT_USER_DESKTOP = 'Delete Service Account User',
  RESET_SERVICE_ACCOUNT_USER_PASSWORD_DESKTOP = 'Reset Service Account User Password',
  MANAGE_ROLE_PERMISSIONS_DESKTOP = 'Create/Delete/Edit Role & Permissions',

  // Price Management - Desktop
  EDIT_BASE_RATE_CREDIT_DESKTOP = 'Edit Service Account Base Rate & Credit',
  TIME_OF_USE_RATE_DESKTOP = 'Time of Use Rate',
  PRICE_BASED_ON_USER_DESKTOP = 'Price Based on Device User',

  // Financial - Desktop
  READ_FINANCIAL_STATS_DESKTOP = 'Read Financial Stats',

  // Usage Stats - App
  READ_USAGE_HISTORY_APP = 'Read Usage History & Stats',

  // Payment - App
  EDIT_PAYMENT_METHOD_APP = 'Edit Payment Method',
  REVIEW_RECEIPT_HISTORY_APP = 'Review Receipt History',
}
