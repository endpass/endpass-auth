import Web3 from 'web3';
import Network from '@endpass/class/Network';
import ProviderFactory from '@endpass/class/ProviderFactory';

const netUrl = Network.NETWORK_URL_HTTP[Network.NET_ID.MAIN][0];

export const web3 = new Web3(netUrl);

export const setWeb3Network = (net = Network.NET_ID.MAIN) => {
  if (
    web3.currentProvider &&
    web3.currentProvider.connection &&
    web3.currentProvider.connection.isMock
  ) {
    return;
  }

  const nextNetUrl = Network.NETWORK_URL_HTTP[net][0];
  const nextProvider = ProviderFactory.getInstance(nextNetUrl);

  web3.setProvider(nextProvider);
};
