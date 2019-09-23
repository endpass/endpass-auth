import { fromWei } from '@/util/number';

describe('number', () => {
  describe('fromWei', () => {
    it('should convert wei to ether', () => {
      expect(fromWei('0')).toBe('0');
      expect(fromWei('1')).toBe('0');
      expect(fromWei('10')).toBe('0');
      expect(fromWei('100')).toBe('0');
      expect(fromWei('1000')).toBe('0');
      expect(fromWei('10000')).toBe('0');
      expect(fromWei('100000')).toBe('0');
      expect(fromWei('1000000')).toBe('0');
      expect(fromWei('10000000')).toBe('0');
      expect(fromWei('100000000')).toBe('0');
      expect(fromWei('1000000000')).toBe('0');
      expect(fromWei('10000000000')).toBe('0');
      expect(fromWei('100000000000')).toBe('0');
      expect(fromWei('1000000000000')).toBe('0.000001');
      expect(fromWei('10000000000000')).toBe('0.00001');
      expect(fromWei('100000000000000')).toBe('0.0001');
      expect(fromWei('1000000000000000')).toBe('0.001');
      expect(fromWei('10000000000000000')).toBe('0.01');
      expect(fromWei('100000000000000000')).toBe('0.1');
      expect(fromWei('1000000000000000000')).toBe('1');
      expect(fromWei('500000000000000000')).toBe('0.5');
      expect(fromWei('123186900000000000')).toBe('0.123186');
      expect(fromWei('12312000000000000000000')).toBe('12312');
    });
  });
});
