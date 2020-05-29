<template>
  <upload-status
    :client-id="clientId"
    :selected-document-type="selectedDocumentType"
    :selected-documents-by-type="selectedDocumentsByType"
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
    selectedDocumentType: {
      type: String,
      required: true,
    },

    selectedDocumentsByType: {
      type: Object,
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
