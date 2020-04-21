<template>
  <upload-status
    @continue="onContinue"
    @create="onCreate"
  />
</template>

<script>
import UploadStatus from './UploadStatus.interactor';

export default {
  name: 'UploadStatusInterface',

  methods: {
    onContinue() {
      this.$emit('next');
    },

    onCreate() {
      this.$emit('create');
    },
  },

  components: {
    UploadStatus,
  },
};
</script>
