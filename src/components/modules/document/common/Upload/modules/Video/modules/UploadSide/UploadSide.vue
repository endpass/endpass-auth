<template>
  <div>
    <upload-header :document-type="documentType" />
    <mobile-suggestions />
    <div>
      <v-button
        :disabled="isLoading"
        skin="quaternary"
        data-test="record-button"
        @click="onRecord"
      >
        {{ recordButtonTitle }}
      </v-button>
      <div
        v-if="error"
        class="upload-side-error"
        data-test="upload-side-error"
      >
        {{ error }}
      </div>
      <div
        v-else
        class="upload-side-record-status"
      >
        {{ recordingStatus }}
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
import UploadHeader from '@/components/modules/document/common/Upload/common/UploadHeader';
import {
  VALIDATE_VIDEO_EXT,
  ACCEPT_VIDEO_MIME_TYPES,
} from '@/components/modules/document/common/Upload/upload.constants';
import createUploadSideController from './UploadSide.controller';
import MobileSuggestions from './modules/MobileSuggestions';

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
    isLoading: false,
    isRecognitionError: false,
    isUploaded: false,
  }),

  computed: {
    isUploadAvailable() {
      return !this.uploadFile || !!this.error || this.isLoading;
    },

    uploadButtonSkin() {
      return this.uploadFile ? 'primary' : 'quaternary';
    },

    isRecordedFile() {
      return this.recordedFile;
    },

    recordButtonTitle() {
      return this.isRecordedFile
        ? this.$t('components.uploadVideo.choose.retake')
        : this.$t('components.uploadVideo.choose.record');
    },

    uploadFile() {
      return this.isRecordedFile ? this.recordedFile : null;
    },

    recordingStatus() {
      return (
        this.isRecordedFile && this.$t('components.uploadVideo.choose.recorded')
      );
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

      if (this.documentId) {
        await this.continueCreateDocument();
      }
    },

    startUpload() {
      this.$emit('start-upload');
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
    MobileSuggestions,
    UploadHeader,
  },
};
</script>

<style lang="postcss">
.upload-side-record-status,
.upload-side-error {
  height: 40px;
  font-size: 12px;
  color: var(--endpass-ui-color-green-2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-side-error {
  color: var(--endpass-ui-color-red-2);
}
</style>
