<template>
  <requested-info
    :doc-types-list="docTypesList"
    :doc-type-to-status="docTypeToStatus"
    :is-show-status="isShowStatus"
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
    onSelectDocumentType(docType) {
      this.$emit('next', {
        selectedDocumentType: docType,
      });
    },
  },

  components: {
    RequestedInfo,
  },
};
</script>
