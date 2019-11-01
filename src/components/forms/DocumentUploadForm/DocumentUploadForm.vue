<template>
  <component
    :is="currentForm"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import UploadProgress from './UploadProgress';
import UploadError from './UploadError';
import UploadFile from './UploadFile';

export default {
  name: 'DocumentUploadForm',

  computed: {
    currentForm() {
      switch (true) {
        case this.$attrs['is-loading']:
          return UploadProgress;
        case !!this.$attrs.error:
          return UploadError;
        default:
          return UploadFile;
      }
    },
  },
};
</script>
