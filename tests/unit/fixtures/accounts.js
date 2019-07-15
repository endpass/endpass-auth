export const address = '0x68Aa50bB77C85F99D55f3Ad3762C5EcD250967Ca';

export const hdv3 = {
  address:
    'xpub6DojZ5fC8cSLRwc95PFfzUDWUSRod2jSWSbhGKEWFJhoTDiJgRva4am9m7ex1Fm1Ege8MDQ7PNEFqkzdgsRS6UooRfDZpgHkD8vNHiMP3zq',
  crypto: {
    cipher: 'aes-128-ctr',
    cipherparams: { iv: 'b58264d466c90f8924f3a6c13ee64463' },
    ciphertext:
      'fea516b5cf51e6d0b5d5c83fc1673a1f0e2563b4523fb409a655a9d53b1e0055586ff4182fbebf00a52a585f595abd917970ab79f8938e5dc60f841a170af265e77ecca1d20beff845db276f8bbe',
    kdf: 'scrypt',
    kdfparams: {
      dklen: 32,
      n: 4,
      p: 8,
      r: 1,
      salt: '951266735f664dc8f0911b8c424d79b285cb962fc0b980b3937f821f912963e2',
    },
    mac: '5e7db9b83ca75c1be99c3587d5dc6882892b3c4556924606eb499da52e38b942',
  },
  id: '26c91dbc-f900-4d7c-8ec5-a9a59c0ecd81',
  version: 3,
};

export const v3KeyStore = {
  crypto: {
    cipher: 'aes-128-ctr',
    ciphertext:
      'f6b857b166a0323b24d14142674d09b4705c2426341425e4b0981844ecd7dded',
    cipherparams: { iv: '81b9180af6cbd9a7f598ce7e5e16ddcd' },
    mac: '6761c11037fda9227943f0842eaada57a17c2be603568615dd363a11814ae455',
    kdf: 'scrypt',
    kdfparams: {
      dklen: 32,
      n: 8192,
      r: 1,
      p: 8,
      salt: '3b9da99375bc33fc89a9353bb83e15fc580aa527fe1eefadb41d41d7f6613b43',
    },
  },
  id: 'a73b83fd-68a2-4012-8c34-419be896fb8d',
  version: 3,
  address: '0x68Aa50bB77C85F99D55f3Ad3762C5EcD250967Cb',
};

export const accountAddress = '0x68Aa50bB77C85F99D55f3Ad3762C5EcD250967Cb';

export const accounts = [
  {
    ...v3KeyStore,
  },
  {
    address: '0x68Aa50bB77C85F99D55f3Ad3762C5EcD250967Ca',
  },
];
