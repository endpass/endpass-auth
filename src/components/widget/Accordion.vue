<template>
  <section class="accordion">
    <slot name="control" />
    <section
      v-show-slide="!collapsed"
      class="accordion-content"
      :style="{ maxHeight: maxHeight }"
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

    collapsed: {
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
