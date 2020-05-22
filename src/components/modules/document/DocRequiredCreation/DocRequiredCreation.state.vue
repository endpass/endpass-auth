<template>
  <doc-required-creation
    :doc-type-to-status="docTypeToStatus"
    :is-statuses-appropriated="isStatusesAppropriated"
    :is-statuses-verified="isStatusesVerified"
    :doc-required-types-list="docRequiredTypesList"
    :is-available-to-apply="isAvailableToApply"
    :selected-documents-by-type="selectedDocumentsByType"
    :available-documents-list="availableDocumentsList"
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
    docRequiredTypesList: {
      type: Array,
      required: true,
    },

    docTypeToStatus: {
      type: Object,
      required: true,
    },

    isAvailableToApply: {
      type: Boolean,
      required: true,
    },

    selectedDocumentsByType: {
      type: Object,
      required: true,
    },

    availableDocumentsList: {
      type: Array,
      required: true,
    },

    isStatusesAppropriated: {
      type: Boolean,
      required: true,
    },

    isStatusesVerified: {
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
