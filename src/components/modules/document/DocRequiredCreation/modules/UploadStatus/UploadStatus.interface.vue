<template>
  <upload-status
    :client-id="clientId"
    :is-available-to-finish="isAvailableToFinish"
    :is-all-doc-required-types-verified="isAllDocRequiredTypesVerified"
    @finish="onFinish"
  />
</template>

<script>
import UploadStatus from './UploadStatus.interactor';
import { documentsRequiredStore as documentsRequiredStoreModule } from '@/store';

export default {
  name: 'UploadStatusInterface',

  documentsRequiredStore: documentsRequiredStoreModule,

  props: {
    isAvailableToFinish: {
      type: Boolean,
      required: true,
    },

    isAllDocRequiredTypesVerified: {
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
    onFinish() {
      this.$emit('finish');
    },
  },

  components: {
    UploadStatus,
  },
};
</script>
