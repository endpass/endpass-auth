const infura = {
  key: 'zU4GTAQ0LjJNKddbyztc',
};
const identity = {
  url: 'https://identity.endpass.com',
};

const hdKeyMnemonic = {
  // phrase: '', //BIP39 mnemonic
  // seed: '', //Derived from mnemonic phrase
  path: `m/44'/60'/0'/0`, // Derivation path
};

const googleClientId =
  '885568627115-sin32pl0317peotp05r69gbmsb00atcj.apps.googleusercontent.com';

const gitClientId = '346108128ad51a5eccd1';

const isProduction = true;

module.exports = {
  infura,
  identity,
  hdKeyMnemonic,
  googleClientId,
  gitClientId,
  isProduction,
};
