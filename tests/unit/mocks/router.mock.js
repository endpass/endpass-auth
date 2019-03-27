import router from '@/router';

jest.mock('@/router', () => {
  return {
    replace: jest.fn(),
  };
});

export default router;
