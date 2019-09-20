<template>
  <div class="document-upload-progress">
    <v-progress-circle
      :progress="progress"
      :is-label-visible="true"
    />
    <span class="document-upload-progress-message">
      {{ label }}
    </span>
  </div>
</template>

<script>
import VProgressCircle from '@endpass/ui/kit/VProgressCircle';

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
