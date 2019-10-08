<template>
  <div class="document-upload-field">
    <document-upload-message
      :message="message"
      :class="{ 'document-upload-message-is-error': error }"
    />
    <div class="document-upload-file">
      {{ fileName }}
      <v-svg-icon
        name="close"
        height="8px"
        width="8px"
        @click.native.prevent="$emit('remove', $event)"
      />
    </div>
    <v-description
      v-if="error"
      disabled
      :description="error"
    />
  </div>
</template>

<script>
import VDescription from '@endpass/ui/kit/VDescription';
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import DocumentUploadMessage from './DocumentUploadMessage';

export default {
  name: 'DocumentUploadFileStatus',
  props: {
    message: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      default: null,
    },
  },
  components: {
    VDescription,
    VSvgIcon,
    DocumentUploadMessage,
  },
};
</script>

<style scoped lang="postcss">
.document-upload-file {
  margin: 6px 0;
  font-weight: bold;
}

.document-upload-message-is-error {
  color: var(--endpass-ui-color-error);
}
</style>
