<template>
  <div class="document-upload-description has-text-centered">
    <v-description
      disabled
      :description="$t('components.uploadDocument.supportFiles')"
    />
    <v-description
      disabled
      :description="$t('components.uploadDocument.fileSize')"
    />
  </div>
</template>

<script>
import VDescription from '@endpass/ui/kit/VDescription';

export default {
  name: 'DocumentUploadDescription',

  components: { VDescription },
};
</script>

<style scoped lang="scss">
.document-upload-description {
  padding-top: 16px;
}
</style>
