type keystoreInfo = {
  address: string,
  type: string,
  hidden: boolean,
}

type v3Keystore = {
  crypto: {
    cipher: string,
    ciphertext: string,
    cipherparams: { iv: string },
    mac: string,
    kdf: string,
    kdfparams: {
      dklen: number,
      n: number,
      r: number,
      p: number,
      salt: string,
    },
  },
  id: string,
  version: number,
  address: string,
}
