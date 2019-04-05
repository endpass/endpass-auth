const infura = {
  key: 'zU4GTAQ0LjJNKddbyztc',
};
const wallet = {
  openUrl: 'https://wallet.endpass.com/#/',
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

const googleClientIdWithVersion =
  '885568627115-pq3o5kh797vlgunfs9301ccdpddo35nu.apps.googleusercontent.com';

const gitClientIdWithVersion = 'e354b5fd4e2d5d79b843';

const isProduction = true;

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
