<template>
  <div class="document-upload-progress">
    <v-progress-circle
      :progress="progressValue"
      :is-label-visible="isShowProgressLabel"
    />
    <span class="document-upload-progress-message">
      {{ label }}
    </span>
  </div>
</template>

<script>
import VProgressCircle from '@endpass/ui/kit/VProgressCircle';

const MIN_PROGRESS_VALUE = 2;

export default {
  name: 'DocumentUploadProgress',
  props: {
    progress: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: '',
    },
  },

  computed: {
    isShowProgressLabel() {
      return !!this.progress;
    },

    progressValue() {
      return this.progress < MIN_PROGRESS_VALUE
        ? MIN_PROGRESS_VALUE
        : this.progress;
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
