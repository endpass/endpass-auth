// @ts-check

export const PORTAL_NAME = 'portal-layout';

export const METHODS = {
  SIGN: 'SIGN',
  ACCOUNT: 'ACCOUNT',
  RECOVER: 'RECOVER',
  GET_SETTINGS: 'GET_SETTINGS',
  AUTH: 'AUTH',
  AUTH_STATUS: 'AUTH_STATUS',
  LOGOUT: 'LOGOUT',
  INITIATE: 'INITIATE',

  // deprecated
  READY_STATE_BRIDGE: 'READY_STATE_BRIDGE',

  BRIDGE_CONNECTION_OPEN: 'BRIDGE_CONNECTION_OPEN',
  BRIDGE_CONNECTION_READY: 'BRIDGE_CONNECTION_READY',
  BRIDGE_CONNECTION_ERROR: 'BRIDGE_CONNECTION_ERROR',

  CHECK_DOCUMENTS_REQUIRED: 'CHECK_DOCUMENTS_REQUIRED',
  EXCHANGE_TOKEN_REQUEST: 'EXCHANGE_TOKEN_REQUEST',
  CREATE_DOCUMENT: 'CREATE_DOCUMENT',
  CREATE_DOCUMENTS_REQUIRED: 'CREATE_DOCUMENTS_REQUIRED',
  GENERATE_WALLET: 'GENERATE_WALLET',

  // Dialog-level messages
  DIALOG_RESIZE: 'DIALOG_RESIZE',
  DIALOG_OPEN: 'DIALOG_OPEN',
  DIALOG_CLOSE: 'DIALOG_CLOSE',

  // Widget-level messages
  WIDGET_CHANGE_MOBILE_MODE: 'WIDGET_CHANGE_MOBILE_MODE',
  WIDGET_EXPAND_REQUEST: 'WIDGET_EXPAND_REQUEST',
  WIDGET_COLLAPSE_REQUEST: 'WIDGET_COLLAPSE_REQUEST',
  WIDGET_EXPAND_RESPONSE: 'WIDGET_EXPAND_RESPONSE',
  WIDGET_COLLAPSE_RESPONSE: 'WIDGET_COLLAPSE_RESPONSE',
  WIDGET_INIT: 'WIDGET_INIT',
  WIDGET_OPEN: 'WIDGET_OPEN',
  WIDGET_CLOSE: 'WIDGET_CLOSE',
  WIDGET_FIT: 'WIDGET_FIT',
  WIDGET_UNMOUNT: 'WIDGET_UNMOUNT',
  WIDGET_LOGOUT: 'WIDGET_LOGOUT',
  WIDGET_GET_SETTING: 'WIDGET_GET_SETTING',
  WIDGET_CHANGE_SETTINGS: 'WIDGET_CHANGE_SETTINGS',
  WIDGET_SET_MOBILE_MODE: 'WIDGET_SET_MOBILE_MODE',

  // Broadcast-level messages
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  LOGOUT_RESPONSE: 'LOGOUT_RESPONSE',
  CHANGE_SETTINGS_REQUEST: 'CHANGE_SETTINGS_REQUEST',
  CHANGE_SETTINGS_RESPONSE: 'CHANGE_SETTINGS_RESPONSE',
};

export const LS_SETTINGS = 'endpass-connect:settings';

export const IDENTITY_MODE = Object.freeze({
  DEFAULT: 'default',
  CUSTOM: 'custom',
  LOCAL: 'local',
});

export const DIRECTION = Object.freeze({
  AUTH: 'auth',
  WIDGET: 'widget',
  CONNECT: 'connect',
});

// TODO: move to wallet constants in @endpass/class
export const WALLET_TYPES = Object.freeze({
  STANDARD: 'StandardAccount',
  HD_MAIN: 'HDMainAccount',
});

export const LOCALES = ['en'];

/**
 * @type {KDFEncryptOptions}
 */
export const ENCRYPT_OPTIONS = {
  kdf: ENV.VUE_APP_KDF_PARAMS_KDF,
  n: ENV.VUE_APP_KDF_PARAMS_N,
};

/**
 * @type {{
 *   FRONT: 'front'
 *   BACK: 'back',
 *   VIDEO: 'video',
 * }}
 */
export const DOCUMENT_SIDES = {
  FRONT: 'front',
  BACK: 'back',
  VIDEO: 'video',
};

/**
 * @type {{
    EMAIL_OTP: 'EMAIL_OTP',
    APP_OTP: 'APP_OTP',
    SMS_OTP: 'SMS_OTP',
 * }}
 */
export const CHALLENGE_TYPES = {
  EMAIL_OTP: 'EMAIL_OTP',
  APP_OTP: 'APP_OTP',
  SMS_OTP: 'SMS_OTP',
};

/**
 * @type {{
  OTP: 'otp',
  SMS: 'sms',
 * }}
 */
export const CHALLENGE_TYPES_ANSWER = {
  OTP: 'otp',
  SMS: 'sms',
};

/**
 * @type {{
 *  NO_CONTENT: 'NoContent',
 *  UPLOADED: 'Uploaded',
 *  PROCESSING: 'Processing',
 *  ERRORED: 'Errored',
 * }}
 */
export const UPLOAD_STATUSES = {
  NO_CONTENT: 'NoContent',
  UPLOADED: 'Uploaded',
  PROCESSING: 'Processing',
  ERRORED: 'Errored',
};

/**
 * document statuses
 * @type {{
    DRAFT: 'Draft',
    RECOGNITION: 'Recognition',
    PENDING_REVIEW: 'PendingReview',
    NOT_READABLE: 'NotReadable',
    NOT_VERIFIED: 'NotVerified',
    VERIFIED: 'Verified',
    CHECK:'CHECK'
  }}
 */
export const DOC_STATUSES = {
  DRAFT: 'Draft',
  RECOGNITION: 'Recognition',
  PENDING_REVIEW: 'PendingReview',
  NOT_READABLE: 'NotReadable',
  NOT_VERIFIED: 'NotVerified',
  VERIFIED: 'Verified',
  CHECK: 'CHECK',
};

/**
 * document types
 * @type {{
    PASSPORT: 'Passport',
    DRIVER_LICENSE: 'DriverLicense',
    PROOF_OF_ADDRESS: 'ProofOfAddress',
    ID_CARD: 'IdCard',
    SELFIE: 'Selfie',
  }}
 */
export const DOC_TYPES = {
  PASSPORT: 'Passport',
  DRIVER_LICENSE: 'DriverLicense',
  PROOF_OF_ADDRESS: 'ProofOfAddress',
  ID_CARD: 'IdCard',
  SELFIE: 'Selfie',
};

/**
 * @type { Array<typeof DOC_TYPES[keyof typeof DOC_TYPES]> }
 */
export const DOC_TYPES_ORDER = [
  DOC_TYPES.PASSPORT,
  DOC_TYPES.DRIVER_LICENSE,
  DOC_TYPES.ID_CARD,
  DOC_TYPES.PROOF_OF_ADDRESS,
  DOC_TYPES.SELFIE,
];

/**
 * @type {{
    USER_DOCUMENT_STATUS_UPDATED: 'user:document:status:updated',
  }}
 */
export const SERVER_EVENT = {
  USER_DOCUMENT_STATUS_UPDATED: 'user:document:status:updated',
};

/**
 *
 * @type {{
    LOGGED_IN: 'LOGGED_IN',
    LOGOUT: 'LOGOUT',
    NOT_LOGGED: 'NOT_LOGGED',
    NEED_PERMISSION: 'NEED_PERMISSION',
  }}
 */
export const AUTH_STATUS_CODE = {
  LOGGED_IN: 'LOGGED_IN',
  LOGOUT: 'LOGOUT',
  NOT_LOGGED: 'NOT_LOGGED',
  NEED_PERMISSION: 'NEED_PERMISSION',
};

export const DEFAULT_RATE_LIMIT_TIMEOUT = 59; // 1 minute

/**
 * Public Scopes
 * @type {{
    OFFLINE_ACCESS: 'offline_access',
    WALLET: 'wallet',
    WALLET_ADDRESS_READ: 'wallet:address:read',
    WALLET_ACCOUNTS_READ: 'wallet:accounts:read',
    USER: 'user',
    USER_EMAIL_READ: 'user:email:read',
    USER_ADDRESS_READ: 'user:address:read',
    USER_PHONE_READ: 'user:phone:read',
    USER_DATA_READ: 'user:data:read',
    DOCUMENTS: 'documents',
    DOCUMENTS_PASSPORT: 'documents:passport',
    DOCUMENTS_PASSPORT_STATUS_READ: 'documents:passport:status:read',
    DOCUMENTS_PASSPORT_DATA_READ: 'documents:passport:data:read',
    DOCUMENTS_PASSPORT_IMAGE_READ: 'documents:passport:image:read',
    DOCUMENTS_PROOF_OF_ADDRESS: 'documents:proof_address',
    DOCUMENTS_PROOF_OF_ADDRESS_STATUS_READ: 'documents:proof_address:status:read',
    DOCUMENTS_PROOF_OF_ADDRESS_DATA_READ: 'documents:proof_address:data:read',
    DOCUMENTS_PROOF_OF_ADDRESS_IMAGE_READ: 'documents:proof_address:image:read',
    DOCUMENTS_DRIVER_LICENSE: 'documents:driver_license',
    DOCUMENTS_DRIVER_LICENSE_STATUS_READ: 'documents:driver_license:status:read',
    DOCUMENTS_DRIVER_LICENSE_DATA_READ: 'documents:driver_license:data:read',
    DOCUMENTS_DRIVER_LICENSE_IMAGE_READ: 'documents:driver_license:image:read',
    DOCUMENTS_ID_CARD: 'documents:id_card',
    DOCUMENTS_ID_CARD_STATUS_READ: 'documents:id_card:status:read',
    DOCUMENTS_ID_CARD_DATA_READ: 'documents:id_card:data:read',
    DOCUMENTS_ID_CARD_IMAGE_READ: 'documents:id_card:image:read',
    DOCUMENTS_SELFIE: 'documents:selfie',
    DOCUMENTS_SELFIE_STATUS_READ: 'documents:selfie:status:read',
  }}
 */
export const PUBLIC_SCOPES = {
  OFFLINE_ACCESS: 'offline_access',
  WALLET: 'wallet',
  WALLET_ADDRESS_READ: 'wallet:address:read',
  WALLET_ACCOUNTS_READ: 'wallet:accounts:read',
  USER: 'user',
  USER_EMAIL_READ: 'user:email:read',
  USER_ADDRESS_READ: 'user:address:read',
  USER_PHONE_READ: 'user:phone:read',
  USER_DATA_READ: 'user:data:read',
  DOCUMENTS: 'documents',
  DOCUMENTS_PASSPORT: 'documents:passport',
  DOCUMENTS_PASSPORT_STATUS_READ: 'documents:passport:status:read',
  DOCUMENTS_PASSPORT_DATA_READ: 'documents:passport:data:read',
  DOCUMENTS_PASSPORT_IMAGE_READ: 'documents:passport:image:read',
  DOCUMENTS_PROOF_OF_ADDRESS: 'documents:proof_address',
  DOCUMENTS_PROOF_OF_ADDRESS_STATUS_READ: 'documents:proof_address:status:read',
  DOCUMENTS_PROOF_OF_ADDRESS_DATA_READ: 'documents:proof_address:data:read',
  DOCUMENTS_PROOF_OF_ADDRESS_IMAGE_READ: 'documents:proof_address:image:read',
  DOCUMENTS_DRIVER_LICENSE: 'documents:driver_license',
  DOCUMENTS_DRIVER_LICENSE_STATUS_READ: 'documents:driver_license:status:read',
  DOCUMENTS_DRIVER_LICENSE_DATA_READ: 'documents:driver_license:data:read',
  DOCUMENTS_DRIVER_LICENSE_IMAGE_READ: 'documents:driver_license:image:read',
  DOCUMENTS_ID_CARD: 'documents:id_card',
  DOCUMENTS_ID_CARD_STATUS_READ: 'documents:id_card:status:read',
  DOCUMENTS_ID_CARD_DATA_READ: 'documents:id_card:data:read',
  DOCUMENTS_ID_CARD_IMAGE_READ: 'documents:id_card:image:read',
  DOCUMENTS_SELFIE: 'documents:selfie',
  DOCUMENTS_SELFIE_STATUS_READ: 'documents:selfie:status:read',
};
