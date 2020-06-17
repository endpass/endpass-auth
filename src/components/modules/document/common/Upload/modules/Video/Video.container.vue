<template>
  <component
    :is="currentComponent"
    :document-type="documentType"
    :recorded-file="recordedFile"
    @start-upload="onStartUpload"
    @next="onNext"
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
    recordedFile: null,
  }),

  methods: {
    /**
     * @param {object} payload
     * @param {keyof typeof DOC_TYPES} payload.documentType
     */
    updateProps(payload) {
      if (!payload) return;

      Object.keys(payload).forEach(propName => {
        this[propName] = payload[propName];
      });
    },

    onStartUpload() {
      this.$emit('start-upload');
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
  },

  components: {
    UploadSide,
    Recorder,
  },
};
</script>
