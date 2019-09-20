<template>
  <div class="document-upload-description">
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

<style scoped lang="postcss">
.document-upload-description {
  padding-top: 16px;
  text-align: center;
}
</style>
