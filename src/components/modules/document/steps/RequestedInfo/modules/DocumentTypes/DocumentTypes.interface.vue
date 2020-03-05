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
      required: true,
    },

    docTypesList: {
      type: Array,
      required: true,
    },

    isShowStatus: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onSelect(documentType) {
      this.$emit('select', documentType);
    },
  },

  components: {
    DocumentTypes,
  },
};
</script>
