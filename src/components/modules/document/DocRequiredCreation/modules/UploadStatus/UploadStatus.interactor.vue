<template>
  <upload-status-layout
    :is-pending="isPending"
    :is-verified="isRequiredDocsVerifiedStatus"
    @continue="onContinue"
    @create="onCreate"
  />
</template>

<script>
import UploadStatusLayout from '@/components/modules/document/common/UploadStatusLayout';

import { documentsRequiredStore } from '@/store';

const TIMEOUT_MS = 30 * 1000;

const EXTRA_TIMEOUT_MS = 2 * 60 * 1000;

export default {
  name: 'UploadStatusInteractor',

  documentsRequiredStore,

  data: () => ({
    isPending: true,
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

    async updateUploadStatus() {
      try {
        this.isPending = true;

        if (!this.$options.documentsRequiredStore.isAllHasAppropriateStatus) {
          await this.$options.documentsRequiredStore.loadDocuments();
        }

        if (!this.$options.documentsRequiredStore.isAllHasAppropriateStatus) {
          this.isPending = false;
          return;
        }

        await new Promise(resolve => setTimeout(resolve, this.pendingTimeout));

        await this.$options.documentsRequiredStore.loadDocuments();
      } finally {
        this.isPending = false;
      }
    },
  },

  async mounted() {
    if (this.isRequiredDocsVerifiedStatus) {
      this.isPending = false;
      return;
    }

    await this.updateUploadStatus();
  },

  components: {
    UploadStatusLayout,
  },
};
</script>
