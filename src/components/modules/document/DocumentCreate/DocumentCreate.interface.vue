<template>
  <document-create
    @request="onRequest"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocumentCreate from './DocumentCreate.state';
import createDocumentController from './DocumentCreateController';

export default {
  name: 'DocumentCreate',

  documentCreateController: createDocumentController(),

  methods: {
    onCancel() {
      this.$options.documentCreateController.cancelCreate();
    },

    onCreate(documentId) {
      this.$options.documentCreateController.finishCreate(documentId);
    },

    onRequest() {
      this.$options.documentCreateController.finishRequest();
    },
  },

  components: {
    DocumentCreate,
  },
};
</script>
