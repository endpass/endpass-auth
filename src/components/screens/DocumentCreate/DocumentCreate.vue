<template>
  <screen @close="onCancel">
    <document-upload
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </screen>
</template>

<script>
import DocumentUpload from './DocumentUpload';
import Screen from '@/components/common/Screen';
import createDocumentController from './DocumentCreateController';

export default {
  name: 'DocumentCreate',

  methods: {
    onCancel() {
      this.$options.documentCreateController.cancelCreate();
    },
    onConfirm(documentId) {
      this.$options.documentCreateController.finishCreate(documentId);
    },
  },

  documentCreateController: createDocumentController(),

  components: {
    Screen,
    DocumentUpload,
  },
};
</script>
