<template>
  <div
    class="document-upload-message"
    :class="{ 'is-error': isError }"
  >
    <div class="document-upload-message-text">
      {{ message }}
    </div>
    <v-description
      v-if="description"
      disabled
      :description="description"
    />
  </div>
</template>

<script>
import VDescription from '@endpass/ui/kit/VDescription';

export default {
  name: 'DocumentUploadMessage',
  props: {
    message: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    isError: {
      type: Boolean,
      default: false,
    },
  },
  components: { VDescription },
};
</script>

<style scoped lang="postcss">
.document-upload-message-text {
  letter-spacing: 1.1px;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: bold;
}

.document-upload-message {
  color: var(--endpass-ui-color-primary-7);
}
.document-upload-message.is-error {
  color: var(--endpass-ui-color-error);
}
</style>
