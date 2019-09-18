import withCommit from '@/streams/middleware/withCommit';

describe('withCommit', () => {
  it('should call withCommit', () => {
    const options = {
      commit: jest.fn(),
    };
    const payload = { data: 'data' };
    withCommit(options, { payload });

    expect(options.commit).toBeCalledWith(payload);
  });
});
