<template>
  <div class="document-upload-description">
    <v-description
      disabled
      :description="supportedFilesTitle"
    />
    <v-description
      disabled
      :description="fileSizeTitle"
    />
  </div>
</template>

<script>
import VDescription from '@endpass/ui/kit/VDescription';

export default {
  name: 'DocumentUploadDescription',

  props: {
    supportedFiles: {
      type: String,
      default: '',
    },

    fileSize: {
      type: String,
      default: '',
    },
  },

  computed: {
    supportedFilesTitle() {
      return (
        this.supportedFiles || this.$t('components.uploadDocument.supportFiles')
      );
    },

    fileSizeTitle() {
      return this.fileSize || this.$t('components.uploadDocument.fileSize');
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
