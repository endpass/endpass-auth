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
