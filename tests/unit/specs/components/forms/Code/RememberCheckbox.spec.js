import { shallowMount, createLocalVue } from '@vue/test-utils';
import RememberCheckbox from '@/components/forms/Code/RememberCheckbox';

import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('RememberCheckbox', () => {
  let wrapper;

  const createWrapper = options => {
    return shallowMount(RememberCheckbox, {
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
    it('should correctly render component', async () => {
      expect.assertions(2);

      expect(wrapper.name()).toBe('RememberCheckbox');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
