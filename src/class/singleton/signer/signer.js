import { bytesToHex } from 'web3-utils';
import keystoreHDWallet from '@endpass/utils/keystoreHDWallet';
import Signer from '@endpass/class/Signer';
import Wallet from '@/class/singleton/signer/Wallet';
import web3, { setWeb3Network } from './web3';
import i18n from '@/locales/i18n';

export default {
  async validatePassword({ v3KeyStore, password }) {
    const wallet = new Wallet(v3KeyStore);
    const isPasswordValid = await wallet.validatePassword(password);

    return isPasswordValid;
  },

  async signDataWithAccount({ account, data, password }) {
    const wallet = new Wallet(account);
    const res = await wallet.sign(data, password);

    return res;
  },

  async recover({ seedPhrase, recoveryIdentifier }) {
    const hdWallet = keystoreHDWallet.createHDWalletBySeed(seedPhrase);
    const wallet = hdWallet.deriveChild(0).getWallet();
    const privateKey = bytesToHex(wallet.getPrivateKey());
    const correctPrivateKey = Signer.privateKeyToStr(privateKey);

    const { signature } = await Signer.sign(
      recoveryIdentifier,
      correctPrivateKey,
    );
    return signature;
  },

  async recoverMessage({ account, request, net }) {
    setWeb3Network(net);

    const wallet = new Wallet(account);
    const res = await wallet.recover(request.params[0], request.params[1]);
    return res;
  },

  async getSignedRequest({ v3KeyStore, request, password, net }) {
    setWeb3Network(net);

    const wallet = new Wallet(v3KeyStore);

    switch (request.method) {
      case 'eth_sendTransaction':
        return wallet.sendSignedTransaction(request.params[0], password);

      case 'eth_signTypedData':
        // const wallet = rootGetters['accounts/wallet'];
        // const request = getters.currentRequest;
        throw new Error(i18n.t('services.signer.typedData'));

      default:
        // eslint-disable-next-line
        const { signature } = await wallet.sign(request.params[0], password);
        return signature;
    }
  },

  setWeb3Network(netId) {
    setWeb3Network(netId);
  },

  getWeb3Instance() {
    return web3;
  },
};
