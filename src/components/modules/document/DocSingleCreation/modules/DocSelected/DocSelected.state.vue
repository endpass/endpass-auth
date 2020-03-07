<template>
  <doc-selected
    :doc-types-list="docTypesList"
    :selected-document-type="selectedDocumentType"
    :document-id.sync="documentId"
    :status.sync="status"
    @create="onCreate"
    @cancel="handleCancel"
    @back="onBack"
  />
</template>

<script>
import DocSelected from './DocSelected.container';

export default {
  name: 'DocSelectedState',

  props: {
    docTypesList: {
      type: Array,
      required: true,
    },

    selectedDocumentType: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    status: '',
    documentId: '',
  }),

  methods: {
    onCreate() {
      this.$emit('create', { documentId: this.documentId });
    },

    handleCancel() {
      this.$emit('cancel');
    },

    onBack() {
      if (!this.documentId) {
        this.handleCancel();
      }
    },
  },

  components: {
    DocSelected,
  },
};
</script>
