<template>
  <doc-required-creation
    :is-loading="isLoading"
    :doc-types-list="docTypesList"
    :doc-type-to-status="docTypeToStatus"
    :documents-list="documentsList"
    :is-required-verified="isRequiredVerified"
    :is-have-bad="isHaveBad"
    :selected-document-type.sync="selectedDocumentType"
    :document-id.sync="documentId"
    :status.sync="status"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocRequiredCreation from './DocRequiredCreation.container';

export default {
  name: 'DocSpecifiedContainer',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    docTypesList: {
      type: Array,
      required: true,
    },

    docTypeToStatus: {
      type: Object,
      required: true,
    },

    documentsList: {
      type: Array,
      required: true,
    },

    isRequiredVerified: {
      type: Boolean,
      required: true,
    },

    isHaveBad: {
      type: Boolean,
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
      this.$emit('create');
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    DocRequiredCreation,
  },
};
</script>
