import toLoader from '@/streams/middleware/toLoader';
import router from '@/router';

describe('toLoader', () => {
  it('should redirect to loader', () => {
    const options = {
      routeName: 'dialogPath',
    };
    toLoader(options);

    expect(router.replace).toBeCalledWith(
      '/loader',
      expect.any(Function),
      expect.any(Function),
    );
  });
});
