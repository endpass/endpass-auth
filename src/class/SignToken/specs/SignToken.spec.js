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
    expect.assertions(1);

    const str = signToken.stringify(checkData);

    const parsed = signToken.parse(str);

    expect(parsed).toEqual(checkData);
  });

  it('should return correct data from string', () => {
    expect.assertions(1);

    const str =
      'eyJkIjp7InNlbGVjdGVkSWRzIjpbImRvY3VtZW50LWlkLXVuaXF1ZS12YWx1ZSJdfSwiaCI6Mzc1MzYyNjMzMn0=';

    expect(signToken.parse(str)).toEqual({
      selectedIds: ['document-id-unique-value'],
    });
  });

  it('should return different hash of objects', () => {
    expect.assertions(1);

    const hashFirst = signToken.getDataHash(checkData);
    const hashSecond = signToken.getDataHash({
      ...checkData,
      num: 11,
    });

    expect(hashFirst).not.toBe(hashSecond);
  });

  it('should return same hash of objects', () => {
    expect.assertions(1);

    const hashFirst = signToken.getDataHash(checkData);
    const hashSecond = signToken.getDataHash(checkData);

    expect(hashFirst).toBe(hashSecond);
  });
});
