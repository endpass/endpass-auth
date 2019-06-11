import Web3 from 'web3';
import Network from '@endpass/class/Network';
import keystoreHDWallet from '@endpass/utils/keystoreHDWallet';
import Wallet from '@/service/signer/Wallet';
import web3 from './web3';

function setWeb3Network(net = Network.NET_ID.MAIN) {
  const netUrl = Network.NETWORK_URL_HTTP[net][0];
  const provider = new web3.providers.HttpProvider(netUrl);

  web3.setProvider(provider);
}

export default {
  async signDataWithAccount({ account, data, password }) {
    const wallet = new Wallet(account);
    const res = await wallet.sign(data, password);

    return res;
  },

  async recover({ seedPhrase, recoveryIdentifier }) {
    const hdWallet = keystoreHDWallet.createHDWalletBySeed(seedPhrase);
    const wallet = hdWallet.deriveChild(0).getWallet();
    const privateKey = Web3.utils.bytesToHex(wallet.getPrivateKey());
    const web3Recover = new Web3(
      Network.NETWORK_URL_HTTP[Network.NET_ID.MAIN][0],
    );
    const { signature } = await web3Recover.eth.accounts.sign(
      recoveryIdentifier,
      privateKey,
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
        throw new Error('Sign typed data not supported yet!');

      default:
        // eslint-disable-next-line
        const { signature } = await wallet.sign(request.params[0], password);
        return signature;
    }
  },
};
