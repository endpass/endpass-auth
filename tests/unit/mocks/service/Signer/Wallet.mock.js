jest.mock('@/class/singleton/signer/Wallet', () => {
  class Wallet {}

  const p = Wallet.prototype;

  p.sign = jest.fn().mockReturnValue({
    signature: 'signature',
  });
  p.getNextNonce = jest.fn();
  p.signTransaction = jest.fn();
  p.sendSignedTransaction = jest.fn();
  p.recover = jest.fn();
  p.signWallet = jest.fn();

  return Wallet;
});
