import widgetMutations from '@/store/modules/widget/mutations';

describe('widget mutations', () => {
  describe('expandWidget', () => {
    it('should set expanded flag to true', () => {
      const state = {
        isExpanded: false,
      };

      widgetMutations.expandWidget(state);

      expect(state.isExpanded).toBe(true);
    });
  });

  describe('minimizeWidget', () => {
    it('should set expanded flag to false', () => {
      const state = {
        isExpanded: true,
      };

      widgetMutations.minimizeWidget(state);

      expect(state.isExpanded).toBe(false);
    });
  });

  describe('setMobileModeStatus', () => {
    it('should set given mobile status', () => {
      const state = {
        isMobile: false,
      };

      widgetMutations.setMobileModeStatus(state, true);

      expect(state.isMobile).toBe(true);

      widgetMutations.setMobileModeStatus(state, false);

      expect(state.isMobile).toBe(false);
    });
  });

  describe('setWidgetLoadingStatus', () => {
    it('should set given loading status', () => {
      const state = {
        isLoading: false,
      };

      widgetMutations.setWidgetLoadingStatus(state, true);

      expect(state.isLoading).toBe(true);

      widgetMutations.setWidgetLoadingStatus(state, false);

      expect(state.isLoading).toBe(false);
    });
  });

  describe('setWidgetPosition', () => {
    it('should set given position', () => {
      const state = {
        position: null,
      };
      const position = {
        top: '10px',
        left: '10px',
      };

      widgetMutations.setWidgetPosition(state, position);

      expect(state.position).toEqual(position);
    });
  });
});
