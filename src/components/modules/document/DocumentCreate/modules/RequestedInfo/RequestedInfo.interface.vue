<template>
  <requested-info
    :types="types"
    :type-to-status="typeToStatus"
    @select-document-type="onSelectDocumentType"
  />
</template>

<script>
import RequestedInfo from './RequestedInfo.view';

export default {
  name: 'RequestedInfoInterface',

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
    onSelectDocumentType(docType) {
      this.$emit('complete', {
        documentType: docType,
      });
    },
  },

  components: {
    RequestedInfo,
  },
};
</script>
