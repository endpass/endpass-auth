import SignToken from '@/class/SignToken';

describe('SignToken', () => {
  const signToken = new SignToken();

  const checkData = {
    list: [1, 2],
    obj: { id: 'id' },
    string: 'string',
    num: 10,
    float: 10.5,
    bool: false,
  };

  it('should decrypt string', () => {
    const str = signToken.stringify(checkData);

    const parsed = signToken.parse(str);

    expect(parsed).toEqual(checkData);
  });

  it('should return different hash of objects', () => {
    const hashFirst = signToken.getObjectHash(checkData);
    const hashSecond = signToken.getObjectHash({
      ...checkData,
      num: 11,
    });

    expect(hashFirst).not.toBe(hashSecond);
  });

  it('should return same hash of objects', () => {
    const hashFirst = signToken.getObjectHash(checkData);
    const hashSecond = signToken.getObjectHash(checkData);

    expect(hashFirst).toBe(hashSecond);
  });
});
