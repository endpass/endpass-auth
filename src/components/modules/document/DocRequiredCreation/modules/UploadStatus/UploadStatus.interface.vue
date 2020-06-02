<template>
  <upload-status
    :client-id="clientId"
    :is-available-to-apply="isAvailableToApply"
    :is-all-required-verified="isAllRequiredVerified"
    @continue="onContinue"
  />
</template>

<script>
import UploadStatus from './UploadStatus.interactor';
import { documentsRequiredStore as documentsRequiredStoreModule } from '@/store';

export default {
  name: 'UploadStatusInterface',

  documentsRequiredStore: documentsRequiredStoreModule,

  props: {
    isAvailableToApply: {
      type: Boolean,
      required: true,
    },

    isAllRequiredVerified: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    clientId() {
      return this.$options.documentsRequiredStore.clientId;
    },
  },

  methods: {
    onContinue() {
      this.$emit('next');
    },
  },

  components: {
    UploadStatus,
  },
};
</script>
