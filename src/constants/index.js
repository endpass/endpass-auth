// @ts-check
import { parseUrl } from '@/util/dom';

export const METHODS = {
  SIGN: 'SIGN',
  ACCOUNT: 'ACCOUNT',
  RECOVER: 'RECOVER',
  GET_SETTINGS: 'GET_SETTINGS',
  AUTH: 'AUTH',
  AUTH_STATUS: 'AUTH_STATUS',
  LOGOUT: 'LOGOUT',
  INITIATE: 'INITIATE',
  READY_STATE_BRIDGE: 'READY_STATE_BRIDGE',
  EXCHANGE_TOKEN_REQUEST: 'EXCHANGE_TOKEN_REQUEST',
  CREATE_DOCUMENT: 'CREATE_DOCUMENT',
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

export const ORIGIN_HOST = parseUrl(document.referrer).origin;

export const WIDGET_RESIZE_DURATION = 300;

export const LOCALES = ['en'];

/**
 * @type {{
 *   kdf: string,
 *   n: number
 * }}
 */
export const ENCRYPT_OPTIONS = {
  kdf: ENV.VUE_APP_KDF_PARAMS_KDF,
  n: ENV.VUE_APP_KDF_PARAMS_N,
};

/**
 * @type {{
 *   BACK: string,
 *   FRONT: string
 * }}
 */
export const DOCUMENT_SIDES = {
  FRONT: 'front',
  BACK: 'back',
};

/**
 * @type {{
 *   ERRORED: string,
 *   PROCESSING: string,
 *   NO_CONTENT: string,
 *   UPLOADED: string
 * }}
 */
export const UPLOAD_STATUSES = {
  NO_CONTENT: 'NoContent',
  UPLOADED: 'Uploaded',
  PROCESSING: 'Processing',
  ERRORED: 'Errored',
};

/**
 * Document types
 * @type {{
    PASSPORT: 'Passport',
    DRIVER_LICENSE: 'DriverLicense',
  }}
 */
export const DOC_TYPES = {
  PASSPORT: 'Passport',
  DRIVER_LICENSE: 'DriverLicense',
};

export const DEFAULT_RATE_LIMIT_TIMEOUT = 59; // 1 minute
