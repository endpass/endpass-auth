import widgetGetters from '@/store/modules/widget/getters';

describe('widget getters', () => {
  describe('isWidgetPinnedToBottom', () => {
    it('should return true if position is not exists', () => {
      const state = {};

      expect(widgetGetters.isWidgetPinnedToBottom(state)).toBe(true);
    });

    it('should return true if top position is not defined', () => {
      const state = {
        position: {
          bottom: '10px',
        },
      };

      expect(widgetGetters.isWidgetPinnedToBottom(state)).toBe(true);
    });

    it('should return false if top position is defined', () => {
      const state = {
        position: {
          top: '10px',
        },
      };

      expect(widgetGetters.isWidgetPinnedToBottom(state)).toBe(false);
    });
  });

  describe('isWidgetPinnedToTop', () => {
    it('should return false if position is not exists', () => {
      const state = {};

      expect(widgetGetters.isWidgetPinnedToTop(state)).toBe(false);
    });

    it('should return false if top position is not defined', () => {
      const state = {
        position: {
          bottom: '10px',
        },
      };

      expect(widgetGetters.isWidgetPinnedToTop(state)).toBe(false);
    });

    it('should return true if top position is defined', () => {
      const state = {
        position: {
          top: '10px',
        },
      };

      expect(widgetGetters.isWidgetPinnedToTop(state)).toBe(true);
    });
  });
});
