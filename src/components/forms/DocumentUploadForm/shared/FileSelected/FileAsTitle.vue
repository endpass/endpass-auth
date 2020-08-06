<template>
  <div @click.prevent="onRemove">
    <upload-title :title="title" />
    <file-name :name="fileName" />
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

  methods: {
    onRemove(ev) {
      this.$emit('file-remove', ev);
    },
  },

  components: {
    FileName,
    UploadTitle,
  },
};
</script>
