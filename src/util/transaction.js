import Web3 from 'web3';

const { fromWei } = Web3.utils;

export const transactionInEth = trx => ({
  ...trx,
  value: fromWei(trx.value),
  gasPrice: fromWei(trx.gasPrice),
});

export default {
  transactionInEth,
};
