<template>
  <screen @close="onClose">
    <document-upload @close="onClose" />
  </screen>
</template>

<script>
import DocumentUpload from './DocumentUpload';
import Screen from '@/components/common/Screen';
import createDocumentController from './DocumentCreateController';

export default {
  name: 'DocumentCreate',

  methods: {
    onClose(isUploaded) {
      this.$options.documentCreateController.finishCreate(isUploaded);
    },
  },

  documentCreateController: createDocumentController(),

  components: {
    Screen,
    DocumentUpload,
  },
};
</script>
