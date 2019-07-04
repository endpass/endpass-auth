import Web3 from 'web3';

const { fromWei } = Web3.utils;

export const transactionInEth = trx => ({
  ...trx,
  value: trx.value ? fromWei(trx.value) : '0',
  gasPrice: trx.gasPrice ? fromWei(trx.gasPrice) : '0',
  gasLimit: trx.gasLimit ? fromWei(trx.gasLimit) : '0',
});

export default {
  transactionInEth,
};
