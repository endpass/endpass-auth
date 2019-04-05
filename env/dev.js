const infura = {
  key: 'zU4GTAQ0LjJNKddbyztc',
};
const identity = {
  url: 'https://identity-dev.endpass.com',
};

const wallet = {
  openUrl: 'https://wallet-dev.endpass.com/#/',
};

const hdKeyMnemonic = {
  // phrase: '', //BIP39 mnemonic
  // seed: '', //Derived from mnemonic phrase
  path: `m/44'/60'/0'/0`, // Derivation path
};

const googleClientId =
  '885568627115-2lu9inbk9n7o1hc0me6dip2ac5drprj0.apps.googleusercontent.com';

const gitClientId = '346108128ad51a5eccd1';

const googleClientIdWithVersion =
  '885568627115-sutcos98pmkmknhonq3qei1rnrd49i2h.apps.googleusercontent.com';

const gitClientIdWithVersion = '09d967653008b4d10c58';

const isProduction = false;

const withVersion = !!process.env.WITH_VERSION;

module.exports = {
  wallet,
  infura,
  identity,
  hdKeyMnemonic,
  googleClientId: withVersion ? googleClientIdWithVersion : googleClientId,
  gitClientId: withVersion ? gitClientIdWithVersion : gitClientId,
  isProduction,
};
