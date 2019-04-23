<template>
  <section class="accordion">
    <slot name="control" />
    <section
      v-show-slide="!isCollapsed"
      :style="{ maxHeight: maxHeight }"
      class="accordion-content"
    >
      <slot />
    </section>
  </section>
</template>

<script>
export default {
  name: 'Accordion',

  props: {
    maxHeight: {
      type: String,
      default: 'none',
    },

    isCollapsed: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lane="postcss">
.accordion-content {
  overflow-y: auto !important;
}
</style>
