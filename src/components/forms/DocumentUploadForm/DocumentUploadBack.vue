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
import UploadFileBack from './UploadFile/UploadFileBack';

export default {
  name: 'DocumentUploadBack',

  computed: {
    currentForm() {
      switch (true) {
        case this.$attrs['is-loading']:
          return UploadProgress;
        case !!this.$attrs.error:
          return UploadError;
        default:
          return UploadFileBack;
      }
    },
  },
};
</script>
