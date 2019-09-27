import { shallowMount, createLocalVue } from '@vue/test-utils';
import VShowSlide from 'v-show-slide';
import Accordion from '@/components/widget/Accordion';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();

localVue.use(VShowSlide);
const i18n = setupI18n(localVue);

describe('Accordion', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Accordion, {
      localVue,
      i18n,
    });
  });

  it('should correctly render', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
