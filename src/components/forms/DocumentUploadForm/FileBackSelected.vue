<template>
  <div>
    <upload-title :title="$t('components.uploadDocument.backIsSelected')" />
    <file-selected
      :file="file"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import UploadTitle from './shared/UploadTitle';
import FileSelected from './shared/FileSelected';

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
    UploadTitle,
  },
};
</script>
