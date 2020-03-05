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

  data() {
    return {
      status: '',
      documentId: '',
      selectedDocumentType: '',
    };
  },

  methods: {
    onCreate({ documentId }) {
      this.$emit('create', { documentId });
    },

    onCancel() {
      this.$emit('update:selected-document-type', '');
    },
  },

  components: {
    DocSelected,
  },
};
</script>
