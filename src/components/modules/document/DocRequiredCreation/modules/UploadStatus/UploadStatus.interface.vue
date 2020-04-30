<template>
  <upload-status
    :is-statuses-verified="$options.documentsRequiredStore.isStatusesVerified"
    :is-statuses-appropriated="
      $options.documentsRequiredStore.isStatusesAppropriated
    "
    :client-id="$options.documentsRequiredStore.clientId"
    @continue="onContinue"
    @create="onCreate"
  />
</template>

<script>
import UploadStatus from './UploadStatus.interactor';
import { documentsRequiredStore as documentsRequiredStoreModule } from '@/store';

export default {
  name: 'UploadStatusInterface',

  documentsRequiredStore: documentsRequiredStoreModule,

  provide() {
    const { documentsRequiredStore } = this.$options;
    return {
      gateway: {
        async loadDocumentsTypesAndStatuses() {
          await documentsRequiredStore.loadDocumentsTypesAndStatuses();
        },
      },
    };
  },

  methods: {
    onContinue() {
      this.$emit('next');
    },

    onCreate() {
      this.$emit('create');
    },
  },

  components: {
    UploadStatus,
  },
};
</script>
