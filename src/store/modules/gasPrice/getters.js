import Web3 from 'web3';

const { fromWei } = Web3.utils;

const labeledGasPricesList = ({ gasPrices }) => {
  if (!gasPrices) return null;

  return Object.keys(gasPrices).reduce(
    (acc, key) =>
      acc.concat({
        label: `${gasPrices[key]} gwei`,
        value: fromWei(gasPrices[key].toString(), 'gwei'),
      }),
    [],
  );
};

export default {
  labeledGasPricesList,
};
