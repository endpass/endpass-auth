<template>
  <document-types
    :doc-types-list="docTypesList"
    :doc-type-to-status="docTypeToStatus"
    :is-show-status="isShowStatus"
    @select="onSelect"
  />
</template>

<script>
import DocumentTypes from './DocumentTypes.view';

export default {
  name: 'DocumentTypesInterface',

  props: {
    docTypeToStatus: {
      type: Object,
      default: () => ({}),
    },

    docTypesList: {
      type: Array,
      required: true,
    },

    isShowStatus: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    onSelect(docType) {
      this.$emit('next', {
        selectedDocumentType: docType,
      });
    },
  },

  components: {
    DocumentTypes,
  },
};
</script>
