import router from '@/router';

jest.mock('@/router', () => ({
  replace: jest.fn(),
}));

export default router;
