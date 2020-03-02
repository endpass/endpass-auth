<template>
  <document-types
    :statuses="statuses"
    @select="onSelect"
  />
</template>

<script>
import DocumentTypes from './DocumentTypes.view';

export default {
  name: 'DocumentTypesInterface',

  props: {
    statuses: {
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
