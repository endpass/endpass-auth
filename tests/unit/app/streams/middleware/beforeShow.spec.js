import beforeShow from '@/streams/middleware/beforeShow';

describe('beforeShow', () => {
  it('should call beforeShow', async () => {
    expect.assertions(1);

    const options = {
      beforeShow: jest.fn(),
    };
    await beforeShow(options);

    expect(options.beforeShow).toBeCalled();
  });
});
