import Channel from '@/class/Channel';

describe('Channel class', () => {
  const channel = new Channel();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create ok answer', () => {
    it('should put and take correct flow', () => {
      const payload = {
        data: 'data',
      };

      const lastPayload = {
        last: 'last',
      };

      channel.put({ wrongData: 'wrong' });

      const dataPromise = channel.take();
      const secondPromise = channel.take();

      channel.put(payload);

      const thirdPromise = channel.take();

      channel.put(lastPayload);

      expect(dataPromise).resolves.toEqual(payload);
      expect(secondPromise).resolves.toEqual(payload);
      expect(thirdPromise).resolves.toEqual(lastPayload);
    });
  });
});
