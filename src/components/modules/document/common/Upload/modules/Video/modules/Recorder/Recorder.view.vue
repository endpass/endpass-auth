<script>
const RECORDER_OVERLAY_CLASSNAME = 'recorder-overlay';

export default {
  name: 'RecorderView',

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
        el.classList.add(RECORDER_OVERLAY_CLASSNAME);
      } else {
        el.classList.remove(RECORDER_OVERLAY_CLASSNAME);
      }
    },
  },

  beforeMount() {
    this.toggleFullScreen(this.isFullScreen);
  },

  beforeDestroy() {
    this.toggleFullScreen(false);
  },

  render(createElement) {
    return createElement('div', this.$slots.default);
  },
};
</script>

<style lang="postcss">
.recorder-overlay {
  background: rgba(0, 0, 0, 0.7);
}
</style>
