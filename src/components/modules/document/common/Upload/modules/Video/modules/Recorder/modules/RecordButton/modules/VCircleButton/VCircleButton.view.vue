<template>
  <button
    class="v-circle-button"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'VCircleView',

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
</style>
