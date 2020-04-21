<template>
  <upload
    :selected-document-type="selectedDocumentType"
    @confirm="onConfirm"
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

    onConfirm({ documentId, status }) {
      this.$options.documentsRequiredStore.changeDocTypeStatus({
        documentType: this.selectedDocumentType,
        status,
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
