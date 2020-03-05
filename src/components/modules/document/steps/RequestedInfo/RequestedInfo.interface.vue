<template>
  <requested-info
    :doc-types-list="docTypesList"
    :doc-type-to-status="docTypeToStatus"
    @select-document-type="onSelectDocumentType"
  />
</template>

<script>
import RequestedInfo from './RequestedInfo.view';

export default {
  name: 'RequestedInfoInterface',

  props: {
    docTypeToStatus: {
      type: Object,
      required: true,
    },

    docTypesList: {
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
