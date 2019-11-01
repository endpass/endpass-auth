<template>
  <div>
    <upload-title :title="$t('components.uploadDocument.frontIsSelected')" />
    <file-selected
      :file="file"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import UploadTitle from '@/components/forms/DocumentUploadForm/shared/UploadTitle';
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
    UploadTitle,
  },
};
</script>
