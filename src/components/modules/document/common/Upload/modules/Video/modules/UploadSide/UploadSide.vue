<template>
  <div>
    <upload-header :document-type="documentType" />
    <drop-area
      :is-loading="isLoading"
      :error.sync="error"
      :description-supported-files="
        $t('components.uploadVideo.descriptions.supportedFiles')
      "
      :accept-mime-types="$options.ACCEPT_VIDEO_MIME_TYPES"
      :validate-extensions="$options.ACCEPT_VIDEO_EXT"
      @change="onFileChange"
    >
      <document-upload-front
        :error="error"
        :is-loading="isLoading"
        :progress-value="$options.uploadSideController.progress"
        :progress-label="$options.uploadSideController.progressLabel"
        :file="selectedFile"
        @file-remove="onFileRemove"
      />
    </drop-area>
    <div>
      <v-button
        :disabled="isLoading"
        skin="quaternary"
        data-test="record-button"
        @click="onRecord"
      >
        {{ recordButtonTitle }}
      </v-button>
      <div class="upload-side-recorded-title">
        {{ recordStateTitle }}
      </div>
      <v-button
        :is-loading="isLoading"
        :disabled="isUploadAvailable"
        :skin="uploadButtonSkin"
        data-test="upload-button"
        @click="onUpload"
      >
        {{ $t('components.uploadDocument.upload') }}
      </v-button>
    </div>
  </div>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import DocumentUploadFront from '@/components/forms/DocumentUploadForm/DocumentUploadFront';
import createUploadSideController from './UploadSide.controller';
import DropArea from '@/components/modules/document/common/Upload/common/DropArea';
import UploadHeader from '@/components/modules/document/common/Upload/common/UploadHeader';
import {
  VALIDATE_VIDEO_EXT,
  ACCEPT_VIDEO_MIME_TYPES,
} from '@/components/modules/document/common/Upload/upload.constants';

export default {
  name: 'UploadSide',

  ACCEPT_VIDEO_EXT: VALIDATE_VIDEO_EXT,
  ACCEPT_VIDEO_MIME_TYPES,

  uploadSideController: createUploadSideController(),

  inject: ['$validator'],

  props: {
    documentType: {
      type: String,
      default: '',
    },

    recordedFile: {
      type: File,
      default: null,
    },
  },

  data: () => ({
    documentId: '',
    error: null,
    selectedFile: null,
    isLoading: false,
    isRecognitionError: false,
    isUploaded: false,
    isUseRecordedFile: true,
  }),

  computed: {
    isUploadAvailable() {
      return !this.uploadFile || !!this.error || this.isLoading;
    },

    uploadButtonSkin() {
      return this.uploadFile ? 'primary' : 'quaternary';
    },

    isUploadReady() {
      return !this.isLoading && !!this.selectedFile && !this.error;
    },

    isRecordedFile() {
      return this.isUseRecordedFile && this.recordedFile;
    },

    recordButtonTitle() {
      return this.isRecordedFile
        ? this.$t('components.uploadVideo.choose.retake')
        : this.$t('components.uploadVideo.choose.record');
    },

    uploadFile() {
      return this.isRecordedFile ? this.recordedFile : this.selectedFile;
    },

    recordStateTitle() {
      return this.isRecordedFile
        ? this.$t('components.uploadVideo.choose.recorded')
        : '';
    },
  },

  watch: {
    documentType() {
      this.error = '';
    },
  },

  methods: {
    onRecord() {
      this.selectedFile = null;
      this.isUseRecordedFile = true;
      this.$emit('next');
    },

    async onUpload() {
      await this.startCreateDocument();
      if (!this.documentId) {
        return;
      }
      await this.continueCreateDocument();
    },

    startUpload() {
      this.$emit('start-upload');
    },

    onFileRemove() {
      this.error = '';
      this.selectedFile = null;
      if (this.recordedFile) {
        this.isUseRecordedFile = true;
      }
      this.isRecognitionError = false;
    },

    onFileChange(files) {
      const [file] = files;
      this.isUseRecordedFile = false;
      this.selectedFile = file;
    },

    async onRecognize() {
      try {
        this.isLoading = true;
        this.isRecognitionError = false;
        const document = await this.$options.uploadSideController.recognize(
          this.documentId,
        );
        this.handleConfirm(document);
      } catch (e) {
        this.isRecognitionError = true;
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },

    async startCreateDocument() {
      try {
        this.isLoading = true;

        this.startUpload();
        this.documentId = await this.$options.uploadSideController.startCreateDocument(
          {
            file: this.uploadFile,
            type: this.documentType,
          },
        );
      } catch (e) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },

    async continueCreateDocument() {
      try {
        this.isLoading = true;
        this.isRecognitionError = false;
        const document = await this.$options.uploadSideController.continueCreateDocument(
          this.documentId,
        );
        this.handleConfirm(document);
      } catch (e) {
        this.isRecognitionError = true;
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },

    handleConfirm(document) {
      this.$emit('confirm', document);
    },
  },

  mounted() {
    this.$options.uploadSideController.init();
  },

  components: {
    VButton,
    UploadHeader,
    DropArea,
    DocumentUploadFront,
  },
};
</script>

<style lang="postcss">
.upload-side-recorded-title {
  height: 40px;
  font-size: 12px;
  color: var(--endpass-ui-color-green-2);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
