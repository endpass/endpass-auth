import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import UploadStatusInteractor from '@/components/modules/document/DocRequiredCreation/modules/UploadStatus/UploadStatus.interactor';
import UploadStatusLayout from '@/components/modules/document/common/UploadStatusLayout';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('UploadStatusInteractor', () => {
  let wrapper;
  let gateway;
  const defaultProps = {
    isStatusesVerified: false,
    isStatusesAppropriated: false,
    clientId: 'clientId',
  };

  const createWrapper = options => {
    gateway = {
      loadDocumentsTypesAndStatuses: jest.fn(),
    };
    return shallowMount(UploadStatusInteractor, {
      localVue,
      propsData: defaultProps,
      i18n,
      provide: {
        gateway,
      },
      ...options,
    });
  };

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('UploadStatusInteractor');
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('flags', () => {
    it('should switch pending to false as default state', async () => {
      expect.assertions(2);

      await global.flushPromises();

      expect(wrapper.find(UploadStatusLayout).props().isVerified).toBe(false);
      expect(wrapper.find(UploadStatusLayout).props().isPending).toBe(false);
    });

    it('should switch pending after timeout', async () => {
      expect.assertions(2);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isStatusesAppropriated: true,
        },
      });

      await global.flushPromises();

      expect(wrapper.find(UploadStatusLayout).props().isPending).toBe(true);

      jest.runOnlyPendingTimers();

      expect(wrapper.find(UploadStatusLayout).props().isPending).toBe(false);
    });

    it('should switch pending to true', async () => {
      expect.assertions(2);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isStatusesAppropriated: true,
        },
      });

      await global.flushPromises();

      expect(wrapper.find(UploadStatusLayout).props().isVerified).toBe(false);
      expect(wrapper.find(UploadStatusLayout).props().isPending).toBe(true);
    });
  });

  describe('timer', () => {
    it('should not use timer', async () => {
      expect.assertions(1);

      await global.flushPromises();

      expect(wrapper.vm.timers.pendingTimer.isRunning).toBe(false);
    });

    it('should use timer', async () => {
      expect.assertions(1);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isStatusesAppropriated: true,
        },
      });

      await global.flushPromises();

      expect(wrapper.vm.timers.pendingTimer.isRunning).toBe(true);
    });

    it('should use 2 min for pending timeout', async () => {
      expect.assertions(1);

      const EXTRA_TIMEOUT_MS = 2 * 60 * 1000;
      const [clientId] = ENV.VUE_APP_EXTRA_TIMEOUT_FOR_CLIENT_IDS;
      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isStatusesAppropriated: true,
          clientId,
        },
      });

      await global.flushPromises();

      expect(wrapper.vm.timers.pendingTimer.time).toBe(EXTRA_TIMEOUT_MS);
    });

    it('should use 30 secs for pending timeout', async () => {
      expect.assertions(1);

      const TIMEOUT_MS = 30 * 1000;
      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isStatusesAppropriated: true,
        },
      });

      await global.flushPromises();

      expect(wrapper.vm.timers.pendingTimer.time).toBe(TIMEOUT_MS);
    });
  });

  describe('events', () => {
    it('should emit continue', async () => {
      expect.assertions(3);

      expect(wrapper.emitted().continue).toBeUndefined();

      wrapper.find(UploadStatusLayout).vm.$emit('continue');
      await global.flushPromises();

      expect(wrapper.emitted().continue).toHaveLength(1);
      expect(wrapper.emitted().continue).toEqual([[]]);
    });

    it('should emit create', async () => {
      expect.assertions(3);

      expect(wrapper.emitted().create).toBeUndefined();

      wrapper.find(UploadStatusLayout).vm.$emit('create');
      await global.flushPromises();

      expect(wrapper.emitted().create).toHaveLength(1);
      expect(wrapper.emitted().create).toEqual([[]]);
    });
  });

  describe('load statuses', () => {
    it('should load types and statuses', async () => {
      expect.assertions(1);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isStatusesVerified: false,
          isStatusesAppropriated: false,
        },
      });

      await global.flushPromises();

      expect(gateway.loadDocumentsTypesAndStatuses).toBeCalledTimes(1);
    });

    it('should not load types and statuses if have appropriate statuses', async () => {
      expect.assertions(1);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isStatusesAppropriated: true,
        },
      });

      await global.flushPromises();

      expect(gateway.loadDocumentsTypesAndStatuses).not.toBeCalled();
    });

    it('should not load types and statuses if not have appropriate statuses but have verified', async () => {
      expect.assertions(1);

      wrapper = createWrapper({
        propsData: {
          ...defaultProps,
          isStatusesVerified: true,
        },
      });

      await global.flushPromises();

      expect(gateway.loadDocumentsTypesAndStatuses).not.toBeCalled();
    });
  });
});
