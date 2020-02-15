import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, code } from '@unitFixtures/auth';
import CodeInteractor from '@/components/screens/public/LoginProvider/modules/Provider/modules/Code/Code.interactor';
import Code from '@/components/modules/Code';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';
import permissionsService from '@/service/permissions';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('CodeInteractor', () => {
  let wrapper;
  const challengeType = CHALLENGE_TYPES.EMAIL_OTP;
  const loginChallenge = 'bar';

  const createWrapper = (options, props) =>
    shallowMount(CodeInteractor, {
      localVue,
      propsData: {
        email,
        challengeType,
        loginChallenge,
        ...props,
      },
      i18n,
      ...options,
    });

  beforeEach(async () => {
    jest.clearAllMocks();

    wrapper = createWrapper();
    await global.flushPromises();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('CodeInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('code-stub').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    describe('submit', () => {
      const redirect = 'new/path';

      it('should handle submit', async () => {
        expect.assertions(1);

        permissionsService.getLoginDetails.mockResolvedValueOnce({});
        permissionsService.login.mockResolvedValueOnce({
          redirect,
        });

        wrapper.find(Code).vm.$emit('submit', { code });

        await global.flushPromises();

        expect(permissionsService.login).toBeCalledWith({
          challengeId: loginChallenge,
          code,
        });
      });

      it('should emit complete', async () => {
        expect.assertions(3);

        expect(wrapper.emitted().complete).toBeUndefined();

        permissionsService.getLoginDetails.mockResolvedValueOnce({});
        permissionsService.login.mockResolvedValueOnce({
          redirect,
        });

        wrapper.find(Code).vm.$emit('submit', { code });

        await global.flushPromises();

        expect(wrapper.emitted().complete.length).toBe(1);
        expect(wrapper.emitted().complete[0]).toEqual([{ redirect }]);
      });
    });

    describe('loading status', () => {
      it('should be false before submit', () => {
        expect(wrapper.find('code-stub').attributes().isloading).toBeFalsy();
      });

      it('should be true after submit', () => {
        wrapper.find(Code).vm.$emit('submit', { code });

        expect(wrapper.find('code-stub').attributes().isloading).toBe('true');
      });

      it('should be false after handling submit', async () => {
        expect.assertions(1);

        wrapper.find(Code).vm.$emit('submit', { code });
        await global.flushPromises();

        expect(wrapper.find('code-stub').attributes().isloading).toBeFalsy();
      });
    });

    describe('error', () => {
      beforeEach(() => {
        permissionsService.login.mockRejectedValueOnce(new Error('error'));
      });

      it('should pass error', async () => {
        expect.assertions(2);

        expect(wrapper.find('code-stub').attributes().error).toBeFalsy();

        wrapper.find(Code).vm.$emit('submit', { code });
        await global.flushPromises();

        expect(wrapper.find('code-stub').attributes().error).toBe(
          i18n.t('components.loginProvider.notWorkingError'),
        );
      });

      it('should remove error if exists before submit', async () => {
        expect.assertions(1);

        wrapper.find(Code).vm.$emit('submit', { code });
        await global.flushPromises();

        wrapper.find(Code).vm.$emit('submit', { code });

        expect(wrapper.find('code-stub').attributes().error).toBeFalsy();
      });
    });

    describe('recover', () => {
      it('should emit recover event', () => {
        expect(wrapper.emitted().recover).toBeUndefined();

        wrapper.find(Code).vm.$emit('recover');

        expect(wrapper.emitted().recover.length).toBe(1);
        expect(wrapper.emitted().recover[0]).toEqual([]);
      });
    });
  });
});
