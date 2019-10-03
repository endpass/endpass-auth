<template>
  <span v-bind="$attrs">
    <slot v-if="isLoading" />
    <template v-else>
      {{ $t('global.loading') }}
    </template>
  </span>
</template>

<script>
export default {
  name: 'VLoadingText',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="postcss"></style>
