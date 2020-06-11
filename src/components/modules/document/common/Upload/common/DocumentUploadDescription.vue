<template>
  <div class="document-upload-description">
    <v-description
      disabled
      :description="supportedFiles"
    />
    <v-description
      disabled
      :description="fileSize"
    />
  </div>
</template>

<script>
import VDescription from '@endpass/ui/kit/VDescription';

export default {
  name: 'DocumentUploadDescription',

  props: {
    descriptionSupportedFiles: {
      type: String,
      default: '',
    },

    descriptionFileSize: {
      type: String,
      default: '',
    },
  },

  computed: {
    supportedFiles() {
      return (
        this.descriptionSupportedFiles ||
        this.$t('components.uploadDocument.supportFiles')
      );
    },

    fileSize() {
      return (
        this.descriptionFileSize ||
        this.$t('components.uploadDocument.fileSize')
      );
    },
  },

  components: { VDescription },
};
</script>

<style scoped lang="postcss">
.document-upload-description {
  padding-top: 16px;
  text-align: center;
}
</style>
