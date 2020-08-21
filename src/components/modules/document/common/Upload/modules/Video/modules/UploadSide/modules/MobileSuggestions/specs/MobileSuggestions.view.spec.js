import UIComponents from '@endpass/ui';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import setupI18n from '@/locales/i18nSetup';

import MobileSuggestions from '../MobileSuggestions.view';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(UIComponents);

describe('UploadVideo > UploadSide > MobileSuggestions', () => {
  let wrapper;

  const createWrapper = options => {
    return shallowMount(MobileSuggestions, {
      localVue,
      i18n,
      sync: false,
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect.assertions(2);

      expect(wrapper.name()).toBe('MobileSuggestionsView');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should correctly render mobile buttons', () => {
      expect.assertions(1);

      expect(
        wrapper.findAll('[data-test=mobile-suggestions-button]'),
      ).toHaveLength(2);
    });
  });
});
