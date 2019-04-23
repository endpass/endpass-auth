import widgetMutations from '@/store/modules/widget/mutations';

describe('widget mutations', () => {
  describe('setWidgetSettings', () => {
    it('should set widget current settings', () => {
      const state = {
        settings: null,
      };
      const settings = {
        activeAccount: '0x0123',
        activeNet: 1,
      };

      widgetMutations.setWidgetSettings(state, settings);

      expect(state).toEqual({
        settings: settings,
      });
    });
  });
});
