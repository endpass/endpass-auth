<template>
  <selected-document-by-type
    :selected-document-type="selectedDocumentType"
    :selected-documents-by-type="selectedDocumentsByType"
    :available-documents-list="availableDocumentsList"
    @select="onSelect"
    @start-upload="onStartUpload"
  />
</template>

<script>
import SelectedDocumentByType from './SelectedDocumentByType.view';
import { documentsRequiredStore } from '@/store';

export default {
  name: 'SelectedDocumentByTypeInteractor',

  documentsRequiredStore,

  props: {
    selectedDocumentType: {
      type: String,
      required: true,
    },

    availableDocumentsList: {
      type: Array,
      required: true,
    },

    selectedDocumentsByType: {
      type: Object,
      required: true,
    },
  },

  methods: {
    onStartUpload() {
      this.$emit('next');
    },

    onSelect(documentId) {
      const documentType = this.selectedDocumentType;
      this.$options.documentsRequiredStore.selectDocumentForType({
        documentType,
        documentId,
      });

      if (!this.selectedDocumentsByType[documentType]) {
        this.$emit('cancel');
      }
    },
  },

  components: {
    SelectedDocumentByType,
  },
};
</script>
