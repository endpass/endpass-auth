<template>
  <upload
    :selected-document-type="selectedDocumentType"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

<script>
import Upload from '@/components/modules/document/common/Upload';

export default {
  name: 'UploadRequiredInteractor',

  inject: ['gateway'],

  props: {
    selectedDocumentType: {
      type: String,
      required: true,
    },
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },

    async onConfirm(document) {
      const { selectedDocumentType: documentType } = this;
      const documentId = document.id;
      await this.gateway.addDocTypeStatus(document);

      await this.gateway.selectDocumentForType({
        documentType,
        documentId,
      });

      this.$emit('next');
    },
  },

  components: {
    Upload,
  },
};
</script>
