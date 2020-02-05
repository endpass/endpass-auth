import Network from '@endpass/class/Network';
import Web3Api from '@endpass/web3/public-api';

const NETWORK_URLS = Network.NETWORK_URL_HTTP;

const defaultUrl = NETWORK_URLS[Network.NET_ID.MAIN][0];

const web3 = new Web3Api({
  netUrl: defaultUrl,
});

export const setWeb3Network = (netId = Network.NET_ID.MAIN) => {
  // :TODO change isMock checking
  if (
    web3.currentProvider &&
    web3.currentProvider.connection &&
    web3.currentProvider.connection.isMock
  ) {
    return;
  }

  const nextNetUrl = NETWORK_URLS[netId][0];
  web3.setNetwork(nextNetUrl);
};

export default web3;
