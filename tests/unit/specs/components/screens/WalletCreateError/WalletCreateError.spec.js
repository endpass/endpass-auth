import UIComponents from '@endpass/ui';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import setupI18n from '@/locales/i18nSetup';
import WalletCreateError from '@/components/screens/WalletCreateError';
import identityService from '@/service/identity';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';
import { walletChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);
localVue.use(UIComponents);

describe('WalletCreateError', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(WalletCreateError, {
      localVue,
      i18n,
      sync: false,
    });
  });

  it('should match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('behaviour', () => {
    it('should send check request with fail response', async () => {
      expect.assertions(1);

      identityService.checkAccountExist.mockRejectedValueOnce('error');

      wrapper.find('[data-test=submit-button]').vm.$emit('click');

      await global.flushPromises();

      expect(bridgeMessenger.send).not.toBeCalled();
    });

    it('should send check request with close dialog', async () => {
      expect.assertions(2);

      const isExist = false;

      identityService.checkAccountExist.mockResolvedValueOnce(isExist);
      const dataPromise = walletChannel.take();

      wrapper.find('[data-test=submit-button]').vm.$emit('click');

      await global.flushPromises();
      const res = await dataPromise;

      expect(res).toEqual(Answer.createOk({ isExist }));
      expect(bridgeMessenger.send).toBeCalledWith(METHODS.DIALOG_CLOSE);
    });
  });
});
