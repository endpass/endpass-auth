<template>
  <div class="document-upload-progress">
    <v-progress-circle
      :progress="Math.floor(progressValue)"
      :is-label-visible="true"
    />
    <span
      v-if="progressLabel"
      class="document-upload-progress-message"
    >
      {{ progressLabel }}
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
    progressLabel: {
      type: String,
      default: '',
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
