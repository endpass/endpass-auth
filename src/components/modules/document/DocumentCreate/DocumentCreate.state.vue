<template>
  <document-create
    :statuses.sync="statuses"
    :is-returnable.sync="isReturnable"
    :is-closable.sync="isClosable"
    :document-type.sync="documentType"
    @request="onRequest"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocumentCreate from './DocumentCreate.container';

export default {
  name: 'DocumentCreate',

  data() {
    return {
      statuses: [],
      isReturnable: false,
      isClosable: false,
      documentType: '',
      isProcessing: false,
    };
  },

  methods: {
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
