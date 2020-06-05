<template>
  <component
    :is="currentSide"
    :document-type="documentType"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

<script>
import Recorder from './modules/Recorder';

export default {
  name: 'VideoContainer',

  props: {
    documentType: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    currentSide: Recorder,
  }),

  methods: {
    onStartUpload() {
      this.$emit('start-upload');
    },

    onConfirm(document) {
      this.$emit('confirm', document);
    },

    onCancel() {
      this.$emit('cancel');
    },
  },
};
</script>
