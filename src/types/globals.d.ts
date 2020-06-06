declare namespace ENV {
  const VUE_APP_VERSION: string;
  const VUE_APP_IDENTITY_API_URL: string;
  const VUE_APP_WALLET_URL: string;
  const VUE_APP_CRYPTODATA_API_URL: string;
  const VUE_APP_IS_PRODUCTION: boolean;
  const VUE_APP_GOOGLE_CLIENT_ID: string;
  const VUE_APP_EXTRA_TIMEOUT_FOR_CLIENT_IDS: string[];
  const VUE_APP_KDF_PARAMS_KDF: KDFTypes.KdfProperty;
  const VUE_APP_IS_E2E_CONNECT: boolean;
  const VUE_APP_KDF_PARAMS_N: number;
  const VUE_APP_SHOW_VERSION_INFO: boolean;
}

interface Window {
  e2eBridge: object;
}
