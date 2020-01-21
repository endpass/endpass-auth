<template>
  <file-selected
    :title="$t('components.uploadDocument.frontIsSelected')"
    :file="file"
    v-on="$listeners"
  />
</template>

<script>
import FileSelected from '@/components/forms/DocumentUploadForm/shared/FileSelected';

export default {
  name: 'FileFrontSelected',

  props: {
    file: {
      type: File,
      default: null,
    },
  },

  components: {
    FileSelected,
  },
};
</script>
