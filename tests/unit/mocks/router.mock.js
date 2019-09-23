import router from '@/router';

jest.mock('@/router', () => {
  const router = {
    replace: jest.fn().mockImplementation(() => {
      const fn = jest.fn();
      fn.catch = jest.fn();
      return fn;
    }),
  };
  return router;
});

export default router;
