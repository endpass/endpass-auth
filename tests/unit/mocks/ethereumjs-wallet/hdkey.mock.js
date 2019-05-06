import HDKey from 'ethereumjs-wallet/hdkey';

jest.mock('ethereumjs-wallet/hdkey', () => ({
  fromMasterSeed: jest.fn(() => ({
    derivePath: jest.fn(() => ({
      deriveChild: jest.fn(() => ({
        getWallet: jest.fn(() => ({
          getPrivateKey: jest.fn(() => [
            239,
            202,
            76,
            221,
            49,
            146,
            59,
            80,
            244,
            33,
            74,
            245,
            210,
            174,
            16,
            231,
            172,
            69,
            165,
            1,
            158,
            148,
            49,
            204,
            25,
            84,
            130,
            215,
            7,
            72,
            83,
            120,
          ]),
        })),
      })),
    })),
  })),
}));

export default HDKey;
