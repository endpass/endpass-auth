<template>
  <div class="document-upload-area">
    <v-file-drop-area
      required
      :label="label"
      :accept="$options.accept"
      :disabled="isLoading"
      @change="onAddFile"
    >
      <div v-if="isLoading">
        <slot name="upload-progress" />
      </div>
      <document-upload-field
        v-else-if="file"
        :message="fileReady"
        :error="fileError"
        :file-name="file.name"
        class="document-upload-field-file"
        @remove="onRemoveFile"
      />
      <document-upload-message
        v-else
        :message="messageAdd"
        :description="$t('components.uploadDocument.orDrop')"
      />
    </v-file-drop-area>
  </div>
</template>

<script>
import VFileDropArea from '@endpass/ui/kit/VFileDropArea';
import DocumentUploadMessage from './DocumentUploadMessage';
import DocumentUploadField from './DocumentUploadFileStatus';

export default {
  name: 'DocumentUploadArea',
  props: {
    label: {
      type: String,
      default: '',
    },
    file: {
      type: File,
      default: null,
    },
    messageAdd: {
      type: String,
      default: '',
    },
    messageReady: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  accept:
    '.png,.jpeg,.jpg,.pdf,.tif,.doc,.docx,image/png,image/jpg,image/jpeg,application/pdf,image/tif,image/tiff,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10Mb
  computed: {
    fileReady() {
      return this.error ? this.$t('global.error') : this.messageReady;
    },
    fileError() {
      return this.file.size > this.$options.MAX_FILE_SIZE
        ? this.$t('components.uploadDocument.errorSizeLimit')
        : this.error;
    },
  },
  methods: {
    onRemoveFile() {
      this.$emit('change', null);
    },
    onAddFile(files) {
      const [file] = files;
      this.$emit('change', file);
    },
  },
  components: {
    VFileDropArea,
    DocumentUploadField,
    DocumentUploadMessage,
  },
  model: {
    prop: 'file',
    event: 'change',
  },
};
</script>

<style scoped lang="postcss">
.document-upload-field-file {
  cursor: pointer;
}
.document-upload-progress-message {
  color: var(--endpass-ui-color-primary-7);
}
</style>
