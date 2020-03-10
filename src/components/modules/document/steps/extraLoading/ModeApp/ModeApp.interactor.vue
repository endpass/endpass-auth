<template>
  <mode-layout
    :is-loading="isLoading"
    :is-verified="isRequiredDocsVerifiedStatus"
    @continue="onContinue"
    @create="onCreate"
  />
</template>

<script>
import ModeLayout from '../ModeLayout';
import createModeAppController from './ModeAppController';

import { documentsRequiredStore } from '@/store';

const TIMEOUT_MS = 3 * 1000;

export default {
  name: 'ModeAppInteractor',

  documentsRequiredStore,

  modeAppController: createModeAppController(),

  props: {
    isHasBadStatus: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    isLoading: true,
  }),

  computed: {
    isRequiredDocsVerifiedStatus() {
      return this.$options.documentsRequiredStore.isRequiredDocsVerifiedStatus;
    },
  },

  methods: {
    onContinue() {
      this.$emit('continue');
    },

    onCreate() {
      this.$emit('create');
    },
  },

  async mounted() {
    if (this.isRequiredDocsVerifiedStatus) {
      this.isLoading = false;
      return;
    }

    try {
      this.isLoading = true;

      if (this.isHasBadStatus) {
        await this.$options.documentsRequiredStore.loadDocuments();
      }

      if (this.isHasBadStatus) {
        this.isLoading = false;
        return;
      }

      await new Promise(resolve => setTimeout(resolve, TIMEOUT_MS));

      await this.$options.documentsRequiredStore.loadDocuments();
    } finally {
      this.isLoading = false;
    }
  },

  components: {
    ModeLayout,
  },
};
</script>
