<template>
  <upload
    :selected-document-type="selectedDocumentType"
    @next="onNext"
    @cancel="onCancel"
  />
</template>

<script>
import Upload from '@/components/modules/document/common/Upload';
import { documentsRequiredStore } from '@/store';

export default {
  name: 'UploadRequiredInteractor',

  documentsRequiredStore,

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

    onNext({ documentId, status }) {
      this.$options.documentsRequiredStore.addDocTypeStatus({
        documentType: this.selectedDocumentType,
        id: documentId,
        status,
      });

      this.$options.documentsRequiredStore.selectDocumentForType({
        documentType: this.selectedDocumentType,
        documentId,
      });

      this.$emit('next', {
        documentId,
        status,
      });
    },
  },

  components: {
    Upload,
  },
};
</script>
