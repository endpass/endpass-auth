<template>
  <upload-status-layout
    :is-pending="isPending"
    :is-verified="isVerified"
    @continue="onContinue"
    @create="onCreate"
  />
</template>

<script>
import UploadStatusLayout from '@/components/modules/document/common/UploadStatusLayout';
import createUploadStatusController from './UploadStatus.controller';
import { DOC_STATUSES } from '@/constants';

export default {
  name: 'UploadStatusInteractor',

  uploadStatusController: createUploadStatusController(),

  props: {
    documentId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isPending: true,
    isVerified: false,
  }),

  methods: {
    onContinue() {
      this.$emit('continue');
    },

    onCreate() {
      this.$emit('create');
    },

    async updateUploadStatus() {
      try {
        this.isPending = true;
        const { uploadStatusController } = this.$options;
        await uploadStatusController.waitDocumentVerified(this.documentId);
        const status = await uploadStatusController.getDocumentStatus(
          this.documentId,
        );

        this.isVerified = status === DOC_STATUSES.VERIFIED;
      } finally {
        this.isPending = false;
      }
    },
  },

  async mounted() {
    if (this.status === DOC_STATUSES.VERIFIED) {
      this.isPending = false;
      this.isVerified = true;
      return;
    }

    await this.updateUploadStatus();
  },

  components: {
    UploadStatusLayout,
  },
};
</script>
