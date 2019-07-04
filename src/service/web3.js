import Web3 from 'web3';
import Network from '@endpass/class/Network';

export const web3 = new Web3();

export const setWeb3Network = (net = Network.NET_ID.MAIN) => {
  const netUrl = Network.NETWORK_URL_HTTP[net][0];
  const provider = new web3.providers.HttpProvider(netUrl);

  web3.setProvider(provider);
};
