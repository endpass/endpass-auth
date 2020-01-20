<template>
  <div>
    <upload-title :title="title" />
    <file-name :file-name="fileName" />
  </div>
</template>

<script>
import UploadTitle from '@/components/forms/DocumentUploadForm/shared/UploadTitle';
import FileName from '@/components/forms/DocumentUploadForm/shared/FileName';

export default {
  name: 'FileAsTitle',

  props: {
    title: {
      type: String,
      default: '',
    },

    fileName: {
      type: String,
      default: '',
    },
  },

  components: {
    FileName,
    UploadTitle,
  },
};
</script>
