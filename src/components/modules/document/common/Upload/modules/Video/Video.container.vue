<template>
  <component
    :is="currentComponent"
    :document-type="documentType"
    @next="onNext"
    @close="onClose"
    @confirm="onConfirm"
    @cancel="onBack"
  />
</template>

<script>
import Recorder from './modules/Recorder';
import UploadSide from './modules/UploadSide';

export default {
  name: 'VideoContainer',

  props: {
    documentType: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    currentComponent: 'upload-side',
  }),

  methods: {
    onStartUpload() {
      this.$emit('start-upload');
    },

    updateProps(payload) {
      if (!payload) return;

      Object.keys(payload).forEach(propName => {
        this[propName] = payload[propName];
      });
    },

    async onNext(payload) {
      this.updateProps(payload);

      await this.$nextTick();

      this.openNextScreen();
    },

    openNextScreen() {
      switch (true) {
        case this.currentComponent === 'upload-side':
          this.currentComponent = 'recorder';
          break;

        case this.currentComponent === 'recorder':
          this.currentComponent = 'upload-side';
          break;

        default:
          throw new Error(
            'Wrong next case with document upload video types upload',
          );
      }
    },

    onClose() {},

    onConfirm(document) {
      this.$emit('confirm', document);
    },

    onBack() {
      switch (true) {
        case this.currentComponent === 'upload-side':
          this.currentComponent = 'recorder';
          break;

        case this.currentComponent === 'recorder':
          this.currentComponent = 'upload-side';
          break;

        default:
          throw new Error(
            'Wrong next case with document upload video types upload',
          );
      }
    },

    onCancel() {
      // this.$emit('cancel');
    },
  },

  components: {
    UploadSide,
    Recorder,
  },
};
</script>
