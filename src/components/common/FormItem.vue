<template>
  <div
    class="form-item"
    :class="cssClass"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FormItem',
  props: {
    isLast: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cssClass() {
      return {
        ...this.$attrs.class,
        [`form-item-is-last`]: this.isLast,
      };
    },
  },
};
</script>

<style lang="postcss">
.form-item {
  margin-bottom: 16px;
}
.form-item-is-last {
  margin-bottom: 24px;
}
</style>
