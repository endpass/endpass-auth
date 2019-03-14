/**
 * Static things
 */
export const INPAGE_EVENTS = {
  SETTINGS: 'INPAGE_PROVIDER_SETTINGS_EVENT',
  RESPONSE: 'INPAGE_PROVIDER_RESPONSE_EVENT',
  REQUEST: 'INPAGE_PROVIDER_REQUEST_EVENT',
};
export const INPAGE_ID_PREFIX = 'ep_';
export const HOST_WINDOW_NAME = 'endpass-connect-host';
export const DIALOG_WINDOW_NAME = 'endpass-connect-dialog';
export const STORAGE_USER_META_KEY = 'endpass-user-meta';
export const AVAILABLE_USER_META_PROPS = ['activeAccount'];
export const DAPP_WHITELISTED_METHODS = [
  'personal_sign',
  'personal_ecRecover',
  'eth_personalSign',
  'eth_signTypedData',
  'eth_sendTransaction',
];

export const METHODS = {
  AUTH: 'AUTH',
  SIGN: 'SIGN',
  LOGOUT: 'LOGOUT',
  ACCOUNT: 'ACCOUNT',
  RECOVER: 'RECOVER',
  GET_SETTINGS: 'GET_SETTINGS',
  RESIZE_DIALOG: 'RESIZE_DIALOG',
  READY_STATE_DIALOG: 'READY_STATE_DIALOG',
  READY_STATE_BRIDGE: 'READY_STATE_BRIDGE',
};
export const LAZY_METHODS = [
  METHODS.AUTH,
  METHODS.SIGN,
  METHODS.LOGOUT,
  METHODS.ACCOUNT,
];

export const LS_SETTINGS = 'endpass-connect:settings';

export const IDENTITY_MODE = Object.freeze({
  DEFAULT: 'default',
  CUSTOM: 'custom',
  LOCAL: 'local',
});
