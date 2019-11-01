<template>
  <div class="document-upload-progress">
    <v-progress-circle
      :progress="progressValue"
      :is-label-visible="true"
    />
    <span
      v-if="label"
      class="document-upload-progress-message"
    >
      {{ label }}
    </span>
  </div>
</template>

<script>
import VProgressCircle from '@endpass/ui/kit/VProgressCircle';

export default {
  name: 'UploadProgress',
  props: {
    progressValue: {
      type: Number,
      default: 0,
    },
    isRecognize: {
      type: Boolean,
      default: false,
    },
    isUploading: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    label() {
      if (this.isUploading) {
        return this.$t('components.uploadDocument.uploading');
      }
      if (this.isRecognize) {
        return this.$t('components.uploadDocument.recognition');
      }

      return '';
    },
  },

  components: { VProgressCircle },
};
</script>

<style scoped lang="postcss">
.document-upload-progress {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.document-upload-progress-message {
  color: var(--endpass-ui-color-primary-7);
}
</style>
