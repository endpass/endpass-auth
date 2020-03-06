<template>
  <mode-document
    :is-loading="isLoading"
    :is-verified="isVerified"
    @continue="onContinue"
  />
</template>

<script>
import ModeDocument from './ModeDocument.container';
import createmodeDocumentController from './ModeDocumentController';
import { DOC_STATUSES } from '@/constants';

export default {
  name: 'ModeDocumentInteractor',

  modeDocumentController: createmodeDocumentController(),

  props: {
    documentId: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isLoading: true,
    isVerified: false,
  }),

  methods: {
    onContinue() {
      this.$emit('continue');
    },
  },

  async mounted() {
    try {
      this.isLoading = true;
      const { modeDocumentController } = this.$options;
      await modeDocumentController.waitDocumentStatus(this.documentId);
      const status = await modeDocumentController.getDocumentStatus(
        this.documentId,
      );
      this.isVerified = status === DOC_STATUSES.VERIFIED;
    } finally {
      this.isLoading = false;
    }
  },

  components: {
    ModeDocument,
  },
};
</script>
