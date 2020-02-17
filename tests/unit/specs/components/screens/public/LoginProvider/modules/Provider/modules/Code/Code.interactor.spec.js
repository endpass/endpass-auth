import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, code } from '@unitFixtures/auth';
import CodeRequestInteractor from '@/components/screens/public/LoginProvider/modules/Provider/modules/CodeRequest/CodeRequest.interactor';
import CodeRequest from '@/components/modules/CodeRequest';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';
import permissionsService from '@/service/permissions';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('CodeRequestInteractor', () => {
  let wrapper;
  const challengeType = CHALLENGE_TYPES.EMAIL_OTP;
  const loginChallenge = 'bar';

  const createWrapper = (options, props) =>
    shallowMount(CodeRequestInteractor, {
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
      expect(wrapper.name()).toBe('CodeRequestInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find(CodeRequest).exists()).toBe(true);
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

        wrapper.find(CodeRequest).vm.$emit('submit', { code });

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

        wrapper.find(CodeRequest).vm.$emit('submit', { code });

        await global.flushPromises();

        expect(wrapper.emitted().complete.length).toBe(1);
        expect(wrapper.emitted().complete[0]).toEqual([{ redirect }]);
      });
    });

    describe('loading status', () => {
      it('should be false before submit', () => {
        expect(wrapper.find(CodeRequest).attributes().isloading).toBeFalsy();
      });

      it('should be true after submit', () => {
        wrapper.find(CodeRequest).vm.$emit('submit', { code });

        expect(wrapper.find(CodeRequest).attributes().isloading).toBe('true');
      });

      it('should be false after handling submit', async () => {
        expect.assertions(1);

        wrapper.find(CodeRequest).vm.$emit('submit', { code });
        await global.flushPromises();

        expect(wrapper.find(CodeRequest).attributes().isloading).toBeFalsy();
      });
    });

    describe('error', () => {
      beforeEach(() => {
        permissionsService.login.mockRejectedValueOnce(new Error('error'));
      });

      it('should pass error', async () => {
        expect.assertions(2);

        expect(wrapper.find(CodeRequest).attributes().error).toBeFalsy();

        wrapper.find(CodeRequest).vm.$emit('submit', { code });
        await global.flushPromises();

        expect(wrapper.find(CodeRequest).attributes().error).toBe(
          i18n.t('components.loginProvider.notWorkingError'),
        );
      });

      it('should remove error if exists before submit', async () => {
        expect.assertions(1);

        wrapper.find(CodeRequest).vm.$emit('submit', { code });
        await global.flushPromises();

        wrapper.find(CodeRequest).vm.$emit('submit', { code });

        expect(wrapper.find(CodeRequest).attributes().error).toBeFalsy();
      });
    });

    describe('recover', () => {
      it('should emit recover event', () => {
        expect(wrapper.emitted().recover).toBeUndefined();

        wrapper.find(CodeRequest).vm.$emit('recover');

        expect(wrapper.emitted().recover).toHaveLength(1);
        expect(wrapper.emitted().recover[0]).toEqual([]);
      });
    });
  });
});
