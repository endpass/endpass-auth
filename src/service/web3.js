import Web3 from 'web3';
import { Network, ProviderFactory } from '@endpass/class';

export const web3 = new Web3();

export const setWeb3Network = (net = Network.NET_ID.MAIN) => {
  if (web3.currentProvider && web3.currentProvider.isMock) {
    return;
  }

  const netUrl = Network.NETWORK_URL_HTTP[net][0];
  const provider = ProviderFactory.getInstance(netUrl);

  web3.setProvider(provider);
};
