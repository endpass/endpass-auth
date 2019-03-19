import syncChannel from '@/class/singleton/syncChannel';

describe('SyncChannel class', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create ok answer', () => {
    it('should put and take correct flow', () => {
      const payload = {
        data: 'data',
      };

      syncChannel.put({ wrongData: 'wrong' });

      const dataPromise = syncChannel.take();
      let error;
      try {
        syncChannel.take();
      } catch (e) {
        error = e;
      }

      syncChannel.put(payload);

      expect(dataPromise).resolves.toEqual(payload);
      expect(error).toEqual(new Error('SyncChannel is busy, doh...'));
    });
  });
});
