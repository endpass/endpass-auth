<template>
  <div
    :style="sizeStyles"
    class="spinner"
  />
</template>

<script>
export default {
  name: 'Spinner',

  props: {
    size: {
      type: Number,
      default: 32,
    },
  },

  computed: {
    sizeStyles() {
      return {
        height: `${this.size}px`,
        width: `${this.size}px`,
      };
    },
  },
};
</script>

<style lang="postcss">
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  border-radius: 50%;
  border: 3px solid #6d1f966e;
  border-top: 3px solid #6d1f96;
  animation: rotate 750ms linear infinite;
}
</style>
