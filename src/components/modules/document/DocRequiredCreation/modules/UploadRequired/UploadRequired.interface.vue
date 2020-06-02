<template>
  <upload-required
    :selected-document-type="selectedDocumentType"
    @next="onNext"
    @cancel="onCancel"
  />
</template>

<script>
import UploadRequired from './UploadRequired.interactor';
import { documentsRequiredStore as documentsRequiredStoreModule } from '@/store';

export default {
  name: 'UploadRequiredInterface',

  documentsRequiredStore: documentsRequiredStoreModule,

  provide() {
    const { documentsRequiredStore } = this.$options;
    return {
      gateway: {
        async addDocTypeStatus(document) {
          await documentsRequiredStore.addDocTypeStatus(document);
        },

        async selectDocumentForType({ documentType, documentId }) {
          await documentsRequiredStore.selectDocumentForType({
            documentType,
            documentId,
          });
        },
      },
    };
  },

  props: {
    selectedDocumentType: {
      type: String,
      required: true,
    },
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },

    onNext() {
      this.$emit('next');
    },
  },

  components: {
    UploadRequired,
  },
};
</script>
