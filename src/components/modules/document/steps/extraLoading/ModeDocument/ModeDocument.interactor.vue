<template>
  <mode-layout
    :is-loading="isLoading"
    :is-verified="isVerified"
    @continue="onContinue"
    @create="onCreate"
  />
</template>

<script>
import ModeLayout from '../ModeLayout';
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

    onCreate() {
      this.$emit('create');
    },
  },

  async mounted() {
    try {
      this.isLoading = true;
      const { modeDocumentController } = this.$options;
      await modeDocumentController.waitDocumentVerified(this.documentId);
      const status = await modeDocumentController.getDocumentStatus(
        this.documentId,
      );

      this.isVerified = status === DOC_STATUSES.VERIFIED;
    } finally {
      this.isLoading = false;
    }
  },

  components: {
    ModeLayout,
  },
};
</script>
