<template>
  <component
    :is="currentForm"
    v-bind="$props"
    v-on="$listeners"
  />
</template>

<script>
import FileFront from './FileFront';
import FileFrontSelected from './FileFrontSelected';
import ErrorFile from './ErrorFile';
import ErrorRecognize from './ErrorRecognize';
import FileBackSelected from './FileBackSelected';
import FileBack from './FileBack';
import UploadProgress from './UploadProgress';

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
      if (this.isLoading) {
        return UploadProgress;
      }

      if (!this.file && this.error) {
        return ErrorRecognize;
      }

      if (this.error && this.file) {
        return ErrorFile;
      }

      if (this.file && this.isFrontSide) {
        return FileFrontSelected;
      }

      if (this.file && !this.isFrontSide) {
        return FileBackSelected;
      }

      if (!this.file && this.isFrontSide) {
        return FileFront;
      }

      if (!this.file && !this.isFrontSide) {
        return FileBack;
      }

      return FileFront;
    },
  },
};
</script>
