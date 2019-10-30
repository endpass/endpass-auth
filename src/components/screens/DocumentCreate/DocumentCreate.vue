<template>
  <screen @close="onClose">
    <document-upload
      @confirm="onConfirm"
      @close="onClose"
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
    onClose() {
      this.$options.documentCreateController.finishCreate();
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
