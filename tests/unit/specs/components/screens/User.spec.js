import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import User from '@/components/screens/User';
import setupI18n from '@/locales/i18nSetup';
import { accountsStore } from '@/store';
import { accountChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

jest.mock('@/class/singleton/bridgeMessenger', () => ({
  send: jest.fn(),
  sendAndWaitResponse: jest.fn().mockReturnValue({}),
  subscribe: jest.fn(),
}));

describe('User', () => {
  let wrapper;

  beforeEach(async () => {
    await accountsStore.defineSettings();
    await accountsStore.defineOnlyV3Accounts();

    wrapper = shallowMount(User, {
      localVue,
      i18n,
    });
  });

  describe('render', () => {
    it('should correctly render User component', () => {
      expect(wrapper.name()).toBe('User');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    it('should set form data from settings on create', () => {
      expect(wrapper.vm.formData).toEqual({
        activeAccount: '0x0',
        activeNet: 1,
      });
    });

    it.skip('should update settings of form submit', () => {
      // const { activeAccount, activeNet } = wrapper.vm.formData;
      //
      // wrapper.find('account-form-stub').vm.$emit('submit');
      // expect(accountsModule.actions.updateSettings).toBeCalledWith(
      //   expect.any(Object),
      //   {
      //     lastActiveAccount: activeAccount,
      //     net: activeNet,
      //   },
      //   undefined,
      // );
    });

    it('should logout if logout button was pressed in form', async () => {
      expect.assertions(2);

      expect(accountsStore.isLogin).toBe(true);

      wrapper.find('account-form-stub').vm.$emit('logout');

      await global.flushPromises();

      expect(accountsStore.isLogin).toBe(false);
    });

    it('should close account if cancel button was pressed in form', async () => {
      expect.assertions(1);

      const dataPromise = accountChannel.take();

      wrapper.find('account-form-stub').vm.$emit('cancel');
      const res = await dataPromise;
      expect(res).toEqual(Answer.createOk({ type: 'close' }));
    });
  });
});
