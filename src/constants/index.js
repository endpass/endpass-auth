export const METHODS = {
  SIGN: 'SIGN',
  ACCOUNT: 'ACCOUNT',
  RECOVER: 'RECOVER',
  GET_SETTINGS: 'GET_SETTINGS',

  AUTH: 'AUTH',
  LOGOUT: 'LOGOUT',
  DIALOG_RESIZE: 'DIALOG_RESIZE',
  DIALOG_OPEN: 'DIALOG_OPEN',
  DIALOG_CLOSE: 'DIALOG_CLOSE',
  INITIATE: 'INITIATE',
  READY_STATE_BRIDGE: 'READY_STATE_BRIDGE',
};

export const LS_SETTINGS = 'endpass-connect:settings';

export const IDENTITY_MODE = Object.freeze({
  DEFAULT: 'default',
  CUSTOM: 'custom',
  LOCAL: 'local',
});

export const DIRECTION = Object.freeze({
  AUTH: 'auth',
  CONNECT: 'connect',
});

export const ORIGIN_HOST = (() => {
  const parser = document.createElement('a');
  parser.href = document.referrer;
  return parser.origin;
})();
