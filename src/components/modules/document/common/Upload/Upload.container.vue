<template>
  <component
    :is="currentSide"
    :document-type="selectedDocumentType"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

<script>
import BackAndFront from './modules/BackAndFront';
import FrontSideOnly from './modules/FrontSideOnly';
import Video from './modules/Video';
import { DOC_TYPES } from '@/constants';

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
    onConfirm(document) {
      this.$emit('confirm', document);
    },

    onCancel() {
      this.$emit('cancel');
    },
  },
};
</script>
