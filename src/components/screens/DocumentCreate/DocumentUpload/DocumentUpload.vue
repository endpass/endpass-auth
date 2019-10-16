<template>
  <v-modal-card
    data-test="document-create-modal"
    :is-closable="!isLoading"
    @close="onClose"
  >
    <template slot="title">
      {{ $t('components.uploadDocument.uploadDocument') }}
    </template>
    <document-upload-form
      v-model="selectedFile"
      v-validate="`ext:${$options.VALIDATE_ACCEPT}`"
      :error="error || errors.first('file')"
      :is-doc-type-selectable="isFrontSide"
      :is-loading="isLoading"
      :document-type="documentType"
      :message-add="messageAdd"
      :message-ready="messageReady"
      :progress-value="progressValue"
      :progress-label="progressLabel"
      :accept="$options.ACCEPT"
      data-vv-as="File"
      data-vv-name="file"
      @change-document-type="onChangeDocType"
      @change-file="onChangeFile"
    />
    <form-controls>
      <v-button
        skin="quaternary"
        :disabled="isLoading"
        data-test="cancel-button"
        @click="onClose"
      >
        {{ $t('global.cancel') }}
      </v-button>
      <v-button
        :is-loading="isLoading"
        :disabled="isLoading || !isReadySubmit"
        data-test="submit-button"
        @click="uploadFile"
      >
        {{ $t('global.confirm') }}
      </v-button>
    </form-controls>
  </v-modal-card>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VModalCard from '@endpass/ui/kit/VModalCard';
import createUploadController from './DocumentUploadController';
import DocumentUploadForm from '@/components/forms/DocumentUploadForm/DocumentUploadForm';
import { DOC_TYPES, DOCUMENT_SIDES } from '@/constants';
import FormControls from '@/components/common/FormControls';

const ACCEPT =
  '.png,.jpeg,.jpg,.pdf,.tif,.doc,.docx,image/png,image/jpg,image/jpeg,application/pdf,image/tif,image/tiff,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const VALIDATE_ACCEPT = ACCEPT.split(',')
  .map(item => (item[0] === '.' ? item.substring(1) : item))
  .join(',');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10Mb

export default {
  name: 'DocumentUpload',

  inject: ['$validator'],

  data: () => ({
    error: null,
    documentType: DOC_TYPES.PASSPORT,
    selectedFile: null,
    documentId: null,
    currentSide: DOCUMENT_SIDES.FRONT,
  }),

  uploadController: null,
  ACCEPT,
  VALIDATE_ACCEPT,

  computed: {
    isFrontSide() {
      return this.currentSide === DOCUMENT_SIDES.FRONT;
    },
    messageAdd() {
      return this.isFrontSide
        ? this.$t('components.uploadDocument.addFile')
        : this.$t('components.uploadDocument.addBackSide');
    },
    messageReady() {
      return this.isFrontSide
        ? this.$t('components.uploadDocument.readyForUpload')
        : this.$t('components.uploadDocument.readyForUploadBack');
    },
    progressValue() {
      return this.$options.uploadController.progress;
    },
    progressLabel() {
      const { uploadController } = this.$options;
      if (uploadController.isUploading) {
        return this.$t('components.uploadDocument.uploading');
      }
      if (uploadController.isProcessing) {
        return this.$t('components.uploadDocument.recognition');
      }
      return '';
    },
    isLoading() {
      const { uploadController } = this.$options;
      return uploadController.isUploading || uploadController.isProcessing;
    },
    isReadySubmit() {
      return !!this.selectedFile && !this.error && this.errors.count() === 0;
    },
  },

  methods: {
    onChangeDocType(documentType) {
      this.error = null;
      this.documentType = documentType;
    },

    onChangeFile(file) {
      this.error = null;
      if (file && file.size > MAX_FILE_SIZE) {
        this.error = this.$t('components.uploadDocument.errorSizeLimit');
      }
    },

    onClose() {
      this.$emit('close', this.documentId);
    },

    nextSide() {
      if (this.currentSide === DOCUMENT_SIDES.FRONT) {
        this.currentSide = DOCUMENT_SIDES.BACK;
        return;
      }

      this.onClose();
    },

    async uploadFile() {
      try {
        const docId = await this.$options.uploadController.uploadDocument({
          file: this.selectedFile,
          type: this.documentType,
          docSide: this.currentSide,
        });

        this.documentId = docId;
        this.selectedFile = null;

        this.nextSide();
      } catch (e) {
        this.error = e.message;
      }
    },
  },

  beforeCreate() {
    this.$options.uploadController = createUploadController();
  },

  components: {
    FormControls,
    DocumentUploadForm,
    VButton,
    VModalCard,
  },
};
</script>
