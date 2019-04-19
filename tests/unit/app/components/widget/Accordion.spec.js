import { shallowMount, createLocalVue } from '@vue/test-utils';
import VShowSlide from 'v-show-slide';
import Accordion from '@/components/widget/Accordion.vue';

const localVue = createLocalVue();

localVue.use(VShowSlide);

describe('Accordion', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Accordion, {
      localVue,
    });
  });

  it('should correctly render', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
