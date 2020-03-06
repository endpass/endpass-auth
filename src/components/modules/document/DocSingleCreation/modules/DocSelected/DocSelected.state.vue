<template>
  <doc-selected
    :doc-types-list="docTypesList"
    :selected-document-type="selectedDocumentType"
    :document-id.sync="documentId"
    :status.sync="status"
    @create="onCreate"
    @close="onClose"
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

    onClose() {
      this.$emit('close');
    },
  },

  components: {
    DocSelected,
  },
};
</script>
