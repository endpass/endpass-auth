<template>
  <accordion :is-collapsed="isCollapsed">
    <section class="widget-content">
      <slot />
    </section>
  </accordion>
</template>

<script>
import Accordion from './Accordion.vue';

export default {
  name: 'WidgetContent',

  props: {
    isCollapsed: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    Accordion,
  },
};
</script>

<style lang="postcss">
.widget-content {
  background-color: #fff;
}
</style>
