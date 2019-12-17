import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ScopesCheckboxTree from '@/components/common/ScopesCheckboxTree';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

localVue.use(Vuex);
const i18n = setupI18n(localVue);

describe('ScopesCheckboxTree', () => {
  const tree = {
    key: 'foo',
    title: 'foo',
    children: {
      'foo:bar:baz': {
        key: 'foo:bar:baz',
        title: 'foo:bar:baz',
        children: {},
      },
    },
  };
  const valuesMap = {
    foo: true,
    'foo:bar:baz': true,
  };

  const wrapperFactory = (options = {}) =>
    shallowMount(ScopesCheckboxTree, {
      localVue,
      i18n,
      ...options,
    });
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = wrapperFactory({
      propsData: {
        level: tree,
        children: tree.children,
        valuesMap,
      },
    });
  });

  describe('render', () => {
    it('should correctly render ScopesCheckboxTree component', () => {
      expect(wrapper.name()).toBe('ScopesCheckboxTree');
    });
  });

  describe('behavior', () => {
    it('should emit change on checkbox change', () => {
      wrapper.find('v-checkbox-stub').vm.$emit('change', false);

      expect(wrapper.emitted().change).toEqual([
        [{ foo: false, 'foo:bar:baz': false }],
      ]);
    });

    it('should not emit anything on change if disabled', () => {
      wrapper = wrapperFactory({
        propsData: {
          level: tree,
          children: tree.children,
          disabled: true,
          valuesMap,
        },
      });
      wrapper.find('v-checkbox-stub').vm.$emit('change', false);

      expect(wrapper.emitted().change).toBeUndefined();
    });

    it('should not emit anything on level change if disabled', () => {
      wrapper = wrapperFactory({
        propsData: {
          level: tree,
          children: tree.children,
          disabled: true,
          valuesMap,
        },
      });
      wrapper.find('scopes-checkbox-tree-stub').vm.$emit('change', {});

      expect(wrapper.emitted().change).toBeUndefined();
    });
  });
});
