<template>
  <requested-info
    :statuses="statuses"
    @select-document-type="onSelectDocumentType"
  />
</template>

<script>
import RequestedInfo from './RequestedInfo.view';

export default {
  name: 'RequestedInfoInterface',

  props: {
    statuses: {
      type: Array,
      default: () => [],
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
