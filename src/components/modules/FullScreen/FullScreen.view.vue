<template>
  <div>
    <slot />
  </div>
</template>

<script>
const OVERLAY_CLASSNAME = 'full-screen-overlay';

export default {
  name: 'FullScreenView',

  props: {
    isFullScreen: {
      type: Boolean,
      required: true,
    },
  },

  watch: {
    isFullScreen(isFlag) {
      this.toggleFullScreen(isFlag);
    },
  },

  methods: {
    toggleFullScreen(isFlag) {
      const el = document.body;

      if (isFlag) {
        el.classList.add(OVERLAY_CLASSNAME);
      } else {
        el.classList.remove(OVERLAY_CLASSNAME);
      }
    },
  },

  beforeMount() {
    this.toggleFullScreen(this.isFullScreen);
  },

  beforeDestroy() {
    this.toggleFullScreen(false);
  },
};
</script>

<style lang="postcss">
.full-screen-overlay {
  background: rgba(0, 0, 0, 0.7);
}
</style>
