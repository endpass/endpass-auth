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
  name: 'UploadSingleInterface',

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
      this.$emit('next', {
        documentId: document.id,
        status: document.status,
      });
    },
  },

  components: {
    Upload,
  },
};
</script>
