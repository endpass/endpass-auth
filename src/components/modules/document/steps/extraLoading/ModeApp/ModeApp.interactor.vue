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

import { documentsRequiredStore } from '@/store';

const TIMEOUT_MS = 30 * 1000;

const EXTRA_TIMEOUT_MS = 2 * 60 * 1000;

export default {
  name: 'ModeAppInteractor',

  documentsRequiredStore,

  props: {
    isAllHasAppropriateStatus: {
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

    pendingTimeout() {
      const extraClientIds = ENV.VUE_APP_EXTRA_TIMEOUT_FOR_CLIENT_IDS;
      const { clientId } = this.$options.documentsRequiredStore;
      if (extraClientIds.includes(clientId)) {
        return EXTRA_TIMEOUT_MS;
      }

      return TIMEOUT_MS;
    },
  },

  methods: {
    onContinue() {
      if (this.isRequiredDocsVerifiedStatus) {
        this.$emit('create');
        return;
      }

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

      if (!this.isAllHasAppropriateStatus) {
        await this.$options.documentsRequiredStore.loadDocuments();
      }

      if (!this.isAllHasAppropriateStatus) {
        this.isLoading = false;
        return;
      }

      await new Promise(resolve => setTimeout(resolve, this.pendingTimeout));

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
