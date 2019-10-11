
declare namespace ENV {
  const VUE_APP_IDENTITY_API_URL: string;
  const VUE_APP_WALLET_URL: string;
  const VUE_APP_CRYPTODATA_API_URL: string;
  const VUE_APP_IS_PRODUCTION: boolean;
  const VUE_APP_GOOGLE_CLIENT_ID: string;
  const VUE_APP_GIT_CLIENT_ID: string;
  const VUE_APP_KDF_PARAMS_KDF: string;
  const VUE_APP_IS_E2E_CONNECT: boolean;
  const VUE_APP_KDF_PARAMS_N: number;
  const VUE_APP_SHOW_VERSION_INFO: boolean;
}

declare module '@endpass/utils/date' {
  function formateDate(date: Date): string;
}

declare module '@endpass/utils/mapToQueryString' {
  function mapToQueryString(url: string, params: object): string;
  export = mapToQueryString;
}

declare module '@endpass/utils/generators' {
  function repeatWithInterval(ms: number): Generator;
  function sleep<T>(ms: number, result: T): Promise<T>;
}

declare module '@endpass/utils/walletGen' {
  function createComplex(password: string, options: object): {
    v3KeystoreHdWallet: v3Keystore,
    v3KeystoreChildWallet: v3Keystore,
    encryptedSeed: string,
    seedKey: string,
  };
}

interface Window {
  e2eBridge: object;
}
