<template>
  <component
    :is="currentSide"
    :document-type="selectedDocumentType"
    @start-upload="onStartUpload"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

<script>
import { DOC_TYPES } from '@/constants';
import BackAndFront from './modules/BackAndFront';
import FrontSideOnly from './modules/FrontSideOnly';
import Video from './modules/Video';

const frontSideOnly = [DOC_TYPES.PASSPORT, DOC_TYPES.PROOF_OF_ADDRESS];

export default {
  name: 'UploadContainer',

  props: {
    selectedDocumentType: {
      type: String,
      default: '',
    },
  },

  computed: {
    currentSide() {
      switch (true) {
        case this.selectedDocumentType === DOC_TYPES.SELFIE:
          return Video;

        case frontSideOnly.includes(this.selectedDocumentType):
          return FrontSideOnly;

        default:
          return BackAndFront;
      }
    },
  },

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
