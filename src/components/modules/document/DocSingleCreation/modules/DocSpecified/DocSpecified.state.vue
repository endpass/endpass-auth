<template>
  <doc-selected
    :doc-types-list="docTypesList"
    :selected-document-type.sync="selectedDocumentType"
    :document-id.sync="documentId"
    :status.sync="status"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocSelected from './DocSpecified.container';

export default {
  name: 'DocSpecifiedContainer',

  props: {
    docTypesList: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    status: '',
    documentId: '',
    selectedDocumentType: '',
  }),

  methods: {
    onCreate() {
      this.$emit('create', {
        documentId: this.documentId,
      });
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    DocSelected,
  },
};
</script>
