<template>
  <div>
    <upload-header :document-type="documentType" />
    <drop-area
      :is-loading="isLoading"
      :error.sync="error"
      :description-supported-files="
        $t('components.uploadVideo.descriptions.supportedFiles')
      "
      :accept-files="$options.ACCEPT_VIDEO"
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
        :disabled="!uploadFile"
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
import { ACCEPT_VIDEO } from '@/components/modules/document/common/Upload/upload.constants';

export default {
  name: 'UploadSide',

  ACCEPT_VIDEO,

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
  }),

  computed: {
    uploadButtonSkin() {
      return this.uploadFile ? 'primary' : 'quaternary';
    },

    isUploadReady() {
      return !this.isLoading && !!this.selectedFile && !this.error;
    },

    recordButtonTitle() {
      return this.recordedFile
        ? this.$t('components.uploadVideo.choose.retake')
        : this.$t('components.uploadVideo.choose.record');
    },

    uploadFile() {
      return this.recordedFile || this.selectedFile;
    },

    recordStateTitle() {
      return this.recordedFile
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
      this.isRecognitionError = false;
    },

    onFileChange(files) {
      const [file] = files;
      this.selectedFile = file;
    },

    onCancel() {
      this.$emit('cancel');
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
