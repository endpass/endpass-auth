import Vuex from 'vuex';
import VueCompositionApi from '@vue/composition-api';
import { mount, createLocalVue } from '@vue/test-utils';
import Bridge from '@/components/screens/Bridge';
import setupI18n from '@/locales/i18nSetup';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';

const localVue = createLocalVue();

const i18n = setupI18n(localVue);
localVue.use(Vuex);
localVue.use(VueCompositionApi);

describe('Bridge', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Bridge, {
      i18n,
      localVue,
    });
  });

  describe('render', () => {
    it('should render "empty" markup', () => {
      expect.assertions(1);

      expect(wrapper.find('[data-test=bridge-loader]').exists()).toBe(true);
    });
  });

  describe('behaviour', () => {
    it('should close dialog', () => {
      expect.assertions(2);

      expect(bridgeMessenger.send).not.toBeCalled();

      wrapper.find('[data-test=modal-card-button-close]').trigger('click');

      expect(bridgeMessenger.send).toBeCalledWith(METHODS.DIALOG_CLOSE);
    });
  });
});
