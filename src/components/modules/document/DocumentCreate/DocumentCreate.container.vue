<template>
  <document-create
    :is-returnable="isReturnable"
    :is-closable="isClosable"
    @cancel="onCancel"
  >
    <component
      :is="currentComponent"
      :is-closable="isClosable"
      :is-returnable="isReturnable"
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
    isReturnable: {
      type: Boolean,
      default: false,
    },

    isClosable: {
      type: Boolean,
      default: false,
    },

    isProcessing: {
      type: Boolean,
      default: false,
    },

    documentType: {
      type: String,
      default: '',
    },
  },

  computed: {
    currentComponent() {
      if (!this.documentType) {
        return RequestedInfo;
      }

      if (this.isProcessing) {
        return ExtraLoading;
      }

      return Upload;
    },
  },

  methods: {
    async onComplete(payload) {
      this.updateProps(payload);
    },

    updateProps(payload) {
      if (!payload) return;

      Object.keys(payload).forEach(propName => {
        this.$emit(`update:${propName}`, payload[propName]);
      });
    },

    onCancel() {
      this.$emit('cancel');
    },

    onCreate(documentId) {
      this.$emit('create', documentId);
    },

    onRequest() {
      this.$emit('request');
    },
  },

  components: {
    DocumentCreate,
  },
};
</script>
