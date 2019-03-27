import holdDialog from '@/streams/middleware/holdDialog';

describe('holdDialog', () => {
  it('should call channel.take()', async () => {
    expect.assertions(1);

    const action = {};

    const options = {
      channel: {
        take: jest.fn(),
      },
    };

    await holdDialog(options, action);

    expect(options.channel.take).toBeCalled();
  });

  it('should not call channel.take()', async () => {
    expect.assertions(1);

    const action = {
      result: 'result',
    };

    const options = {
      channel: {
        take: jest.fn(),
      },
    };

    await holdDialog(options, action);

    expect(options.channel.take).not.toBeCalled();
  });
});
