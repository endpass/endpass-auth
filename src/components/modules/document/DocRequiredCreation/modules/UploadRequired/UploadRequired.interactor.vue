<template>
  <upload
    :selected-document-type="selectedDocumentType"
    @next="onNext"
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

    async onNext({ documentId, status, dateOfExpiry }) {
      const { selectedDocumentType: documentType } = this;
      await this.gateway.addDocTypeStatus({
        documentType,
        documentId,
        status,
        dateOfExpiry,
      });

      await this.gateway.selectDocumentForType({
        documentType,
        documentId,
      });

      this.$emit('next', {
        documentId,
        status,
      });
    },
  },

  components: {
    Upload,
  },
};
</script>
