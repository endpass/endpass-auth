import { transactionInEth } from '@/util/transaction';
import { requestTrx } from '@unitFixtures/requests';

describe('transactionInEth', () => {
  it('should transform wei values to eth', () => {
    expect(transactionInEth(requestTrx)).toEqual({
      gasLimit: '60678575.854435905636937776',
      gasPrice: '0.000056282059911216',
      to: '0xaEF74e25181b0879d293396Dd9949Cf25b339407',
      value: '981.149764202833915952',
    });
  });
});
