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
import UploadFileFront from './UploadFile/UploadFileFront';

export default {
  name: 'DocumentUploadFront',

  computed: {
    currentForm() {
      switch (true) {
        case this.$attrs['is-loading']:
          return UploadProgress;
        case !!this.$attrs.error:
          return UploadError;
        default:
          return UploadFileFront;
      }
    },
  },
};
</script>
