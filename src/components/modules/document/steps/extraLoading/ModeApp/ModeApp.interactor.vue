<template>
  <mode-layout
    :is-loading="isLoading"
    :is-verified="isVerified"
    @continue="onContinue"
  />
</template>

<script>
import ModeLayout from '../ModeLayout';
import createModeAppController from './ModeAppController';
import { DOC_STATUSES } from '@/constants';

export default {
  name: 'ModeAppInteractor',

  modeAppController: createModeAppController(),

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
      const { modeAppController } = this.$options;
      await modeAppController.waitDocumentVerified(this.documentId);
      const status = await modeAppController.getDocumentStatus(this.documentId);
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
