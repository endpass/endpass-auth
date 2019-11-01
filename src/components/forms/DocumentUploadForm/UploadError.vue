<template>
  <component
    :is="currentForm"
    v-bind="$props"
    v-on="$listeners"
  />
</template>

<script>
import ErrorFile from './ErrorFile';
import ErrorRecognize from './ErrorRecognize';

export default {
  name: 'UploadError',

  props: {
    file: {
      type: File,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
  },

  computed: {
    currentForm() {
      if (!this.file) {
        return ErrorRecognize;
      }

      return ErrorFile;
    },
  },
};
</script>
