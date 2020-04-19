<template>
  <doc-required-creation
    :doc-types-list="docTypesList"
    :doc-type-to-status="docTypeToStatus"
    :is-all-has-appropriate-status="isAllHasAppropriateStatus"
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
    docTypesList: {
      type: Array,
      required: true,
    },

    docTypeToStatus: {
      type: Object,
      required: true,
    },

    isAllHasAppropriateStatus: {
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
