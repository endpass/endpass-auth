<template>
  <document-create @cancel="onCancel">
    <component
      :is="currentComponent"
      :document-type="documentType"
      :types="types"
      :type-to-status="typeToStatus"
      @complete="onComplete"
      @cancel="onCancel"
    />
  </document-create>
</template>

<script>
import DocumentCreate from './DocumentCreate.view';

import RequestedInfo from './modules/RequestedInfo';
import Upload from './modules/Upload';
import ExtraLoading from './modules/ExtraLoading';

export default {
  name: 'DocumentCreateContainer',

  props: {
    documentType: {
      type: String,
      default: '',
    },

    typeToStatus: {
      type: Object,
      required: true,
    },

    types: {
      type: Array,
      required: true,
    },

    isExtraLoading: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    currentComponent() {
      if (!this.documentType) {
        return RequestedInfo;
      }

      if (this.isExtraLoading) {
        return ExtraLoading;
      }

      return Upload;
    },
  },

  methods: {
    async onComplete(payload) {
      this.$emit('complete', payload);
    },

    onCancel() {
      this.$emit('cancel');
    },

    onCreate(documentId) {
      this.$emit('create', documentId);
    },
  },

  components: {
    DocumentCreate,
  },
};
</script>
