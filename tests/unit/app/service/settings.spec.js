import settingService from '../../../../src/service/settings'; // must be not alias path!

jest.unmock('@/service/settings');

describe('settings service', () => {
  describe('mergeSettings', () => {
    it('should apply local settings instead of passed', () => {
      settingService.setLocalSettings({});

      const firstSettings = settingService.mergeSettings({
        lastActiveAccount: 'first',
      });

      expect(firstSettings).toEqual({
        lastActiveAccount: 'first',
      });

      settingService.setLocalSettings(firstSettings);

      const secondSettings = settingService.mergeSettings({
        field: 'field',
        lastActiveAccount: 'next',
      });

      expect(secondSettings).toEqual({
        lastActiveAccount: 'first',
      });
    });
  });
});
