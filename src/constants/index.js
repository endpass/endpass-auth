export const NET_ID = Object.freeze({
  MAIN: 1,
  ROPSTEN: 3,
  RIN: 4,
  ETH_CLASSIC: 61,
});

/**
 * Networks map
 */
export const NETWORK_URL = Object.freeze({
  ETH: [
    // 'wss://eth-mainnet.endpass.com:2084',
    // 'wss://eth-mainnet.endpass.com',
    'https://eth-mainnet.endpass.com:2083',
    `https://mainnet.infura.io/${ENV.infura.key}`,
  ],
  ROP: [
    // 'wss://eth-ropsten.endpass.com:2084',
    // 'wss://eth-ropsten.endpass.com',
    'https://eth-ropsten.endpass.com:2083',
    `https://ropsten.infura.io/${ENV.infura.key}`,
  ],
  RIN: [`https://rinkeby.infura.io/${ENV.infura.key}`],
  ETC: [
    // 'wss://etc-mainnet.endpass.com:2084',
    // 'wss://etc-mainnet.endpass.com',
    'https://etc-mainnet.endpass.com:2083',
    'https://etc-geth.0xinfra.com',
  ],
});

export const DEFAULT_NETWORKS = Object.freeze({
  [NET_ID.MAIN]: {
    id: NET_ID.MAIN,
    networkType: 'main',
    currency: 1,
    name: 'Main',
    url: NETWORK_URL.ETH,
  },
  [NET_ID.ROPSTEN]: {
    id: NET_ID.ROPSTEN,
    name: 'Ropsten',
    networkType: 'ropsten',
    currency: 2,
    url: NETWORK_URL.ROP,
  },
  [NET_ID.RIN]: {
    id: NET_ID.RIN,
    name: 'Rinkeby',
    networkType: 'rinkeby',
    currency: 2,
    url: NETWORK_URL.RIN,
  },
  [NET_ID.ETH_CLASSIC]: {
    id: NET_ID.ETH_CLASSIC,
    name: 'Ethereum classic',
    networkType: 'ethClassic',
    currency: 3,
    url: NETWORK_URL.ETC,
  },
});

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
