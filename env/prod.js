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
  '40902679276-u58ff6beacnqv4r4in522bgmib6asrkl.apps.googleusercontent.com';

const gitClientId = 'cb221235046b6d197ea4';

const isProduction = true;

module.exports = {
  infura,
  identity,
  hdKeyMnemonic,
  googleClientId,
  gitClientId,
  isProduction,
};
