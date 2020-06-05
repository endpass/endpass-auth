<script>
export default {
  name: 'RecorderInteractor',

  inject: ['gateway'],

  methods: {
    onConfirm(document) {
      this.$emit('confirm', document);
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  async beforeMount() {
    await this.gateway.setFullScreen();
    this.$emit('update:isFullScreen', true);
  },

  async beforeDestroy() {
    await this.gateway.setNormalScreen();
    this.$emit('update:isFullScreen', false);
  },

  render(createElement) {
    return createElement('div', this.$slots.default);
  },
};
</script>
