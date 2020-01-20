<template>
  <component
    :is="current"
    :title="$t('components.uploadDocument.frontIsSelected')"
    :file="file"
    @file-remove="$listeners['file-remove']"
  />
</template>

<script>
import UploadTitle from '@/components/forms/DocumentUploadForm/shared/UploadTitle';
import FileAsImage from './FileAsImage';
import FileAsTitle from './FileAsTitle';

export default {
  name: 'FileSelected',

  props: {
    file: {
      type: File,
      default: null,
    },
  },

  computed: {
    isImage() {
      const { file } = this;
      if (!file) return false;
      return file.type.indexOf('image') === 0;
    },
    current() {
      return this.isImage ? FileAsImage : FileAsTitle;
    },
  },

  components: {
    FileAsImage,
    FileAsTitle,
    UploadTitle,
  },
};
</script>
