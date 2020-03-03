<template>
  <document-create
    :is-closable="isClosable"
    @cancel="onClose"
  >
    <component
      :is="currentComponent"
      :document-type="documentType"
      :types="types"
      :type-to-status="typeToStatus"
      @upload="onUpload"
      @complete="handleComplete"
      @cancel="onCancel"
    />
  </document-create>
</template>

<script>
import DocumentCreate from './DocumentCreate.view';

import RequestedInfo from './modules/RequestedInfo';
import Upload from './modules/Upload';
import ExtraLoading from './modules/ExtraLoading';
import NoTypes from './modules/NoTypes';

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
    isClosable() {
      // TODO: add check from store
      return !this.documentType;
    },

    currentComponent() {
      if (this.types.length === 0) {
        return NoTypes;
      }

      if (this.isExtraLoading) {
        return ExtraLoading;
      }

      if (!this.documentType) {
        return RequestedInfo;
      }

      return Upload;
    },
  },

  methods: {
    async handleComplete(payload) {
      this.$emit('complete', payload);
    },

    onClose() {
      this.$emit('close');
    },

    onCancel() {
      this.$emit('cancel');
    },

    onUpload(documentId) {
      this.$emit('create', documentId);
    },
  },

  components: {
    DocumentCreate,
  },
};
</script>
