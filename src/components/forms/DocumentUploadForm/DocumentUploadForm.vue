<template>
  <component
    :is="currentForm"
    v-bind="$props"
    v-on="$listeners"
  />
</template>

<script>
import UploadProgress from './UploadProgress';
import UploadError from './UploadError';
import UploadFile from './UploadFile';

export default {
  name: 'DocumentUploadForm',

  props: {
    isFrontSide: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isRecognize: {
      type: Boolean,
      default: false,
    },
    isUploading: {
      type: Boolean,
      default: false,
    },
    progressValue: {
      type: Number,
      default: 0,
    },
    file: {
      type: File,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
  },

  computed: {
    currentForm() {
      switch (true) {
        case this.isLoading:
          return UploadProgress;
        case !!this.error:
          return UploadError;
        default:
          return UploadFile;
      }
    },
  },
};
</script>
