<template>
  <div class="document-upload-area">
    <v-file-drop-area
      required
      :label="label"
      :accept="accept"
      :disabled="isLoading"
      @change="onAddFile"
    >
      <div v-if="isLoading">
        <slot name="upload-progress" />
      </div>
      <div v-else-if="file || error">
        <document-upload-field
          v-if="file"
          :message="fileReady"
          :error="error"
          :file-name="file.name"
          class="document-upload-field-file"
          @remove="onRemoveFile"
        />
        <v-description
          v-if="error"
          disabled
          :description="error"
        />
      </div>
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
import VDescription from '@endpass/ui/kit/VDescription';
import DocumentUploadMessage from './DocumentUploadMessage';
import DocumentUploadField from './DocumentUploadFileStatus';

export default {
  name: 'DocumentUploadArea',

  props: {
    label: {
      type: String,
      default: '',
    },
    accept: {
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
  computed: {
    fileReady() {
      return this.error ? this.$t('global.error') : this.messageReady;
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
    VDescription,
    VFileDropArea,
    DocumentUploadField,
    DocumentUploadMessage,
  },
};
</script>

<style scoped lang="postcss">
.document-upload-field-file {
  cursor: pointer;
}
</style>
