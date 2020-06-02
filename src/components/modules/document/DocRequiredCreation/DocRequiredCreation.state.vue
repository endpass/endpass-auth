<template>
  <doc-required-creation
    :doc-required-types-list="docRequiredTypesList"
    :is-available-to-apply="isAvailableToApply"
    :is-all-required-verified="isAllRequiredVerified"
    :selected-documents-by-type="selectedDocumentsByType"
    :available-documents-list="availableDocumentsList"
    :selected-document-type.sync="selectedDocumentType"
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

    isAvailableToApply: {
      type: Boolean,
      required: true,
    },

    isAllRequiredVerified: {
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
  },

  data: () => ({
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
