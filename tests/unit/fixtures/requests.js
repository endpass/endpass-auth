export const requestTrx = {
  to: '0xaEF74e25181b0879d293396Dd9949Cf25b339407',
  value: '0x353030303030303030',
  gasPrice: '0x333030303030',
  gasLimit: '0x3231303030303030303030',
};
export const requestWithMessage = {
  address: '0xaEF74e25181b0879d293396Dd9949Cf25b339407',
  url: 'http://localhost',
  request: {
    params: ['0xaEF74e25181b0879d293396Dd9949Cf25b339407', '0x68656c6c6f'],
  },
};
export const requestWithTransaction = {
  address: '0xaEF74e25181b0879d293396Dd9949Cf25b339407',
  url: 'http://localhost',
  request: {
    method: 'eth_sendTransaction',
    params: [{ ...requestTrx }],
  },
};
export const transactionInEth = {
  to: '0xaEF74e25181b0879d293396Dd9949Cf25b339407',
  value: '0.05',
  gasPrice: '0.0000005',
  gasLimit: '21000',
};
