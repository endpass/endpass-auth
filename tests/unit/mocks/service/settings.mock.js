import settingsService from '@/service/settings';

jest.mock('@/service/settings', () => {
  return {
    getLocalSettings: jest.fn(),
    setLocalSettings: jest.fn(),
    clearLocalSettings: jest.fn(),
    mergeSettings: jest.fn(),
 };
});

export default settingsService;
