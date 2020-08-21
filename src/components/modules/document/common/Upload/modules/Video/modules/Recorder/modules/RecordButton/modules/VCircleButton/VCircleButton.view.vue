<template>
  <button
    class="v-circle-button"
    :disabled="isDisabled"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'VCircleView',

  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="postcss">
.v-circle-button {
  cursor: pointer;
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--endpass-ui-color-white);
}

.v-circle-button:disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
