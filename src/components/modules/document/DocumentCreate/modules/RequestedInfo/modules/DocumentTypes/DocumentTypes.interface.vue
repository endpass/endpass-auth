<template>
  <document-types
    :types="types"
    :type-to-status="typeToStatus"
    @select="onSelect"
  />
</template>

<script>
import DocumentTypes from './DocumentTypes.view';

export default {
  name: 'DocumentTypesInterface',

  props: {
    typeToStatus: {
      type: Object,
      required: true,
    },

    types: {
      type: Array,
      required: true,
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
