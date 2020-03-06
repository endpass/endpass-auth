<template>
  <doc-selected
    :doc-types-list="docTypesList"
    :selected-document-type="selectedDocumentType"
    :document-id.sync="documentId"
    :status.sync="status"
    @create="onCreate"
    @cancel="onCancel"
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
    onCreate({ documentId }) {
      this.$emit('create', { documentId });
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
