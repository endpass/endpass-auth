<template>
  <file-selected
    :title="$t('components.uploadDocument.backIsSelected')"
    :file="file"
    v-on="$listeners"
  />
</template>

<script>
import FileSelected from '@/components/forms/DocumentUploadForm/shared/FileSelected';

export default {
  name: 'FileBackSelected',

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
