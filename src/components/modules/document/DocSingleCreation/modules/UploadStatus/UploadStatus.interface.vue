<template>
  <upload-status
    :document-id="documentId"
    :status="status"
    @continue="onCreate"
    @create="onCreate"
  />
</template>

<script>
import UploadStatus from './UploadStatus.interactor';

export default {
  name: 'UploadStatusInterface',

  props: {
    documentId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },
  },

  methods: {
    onCreate() {
      this.$emit('create');
    },
  },

  components: {
    UploadStatus,
  },
};
</script>
