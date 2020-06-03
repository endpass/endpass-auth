<template>
  <div>
    <drop-area
      :is-loading="isLoading"
      :error.sync="error"
      @change="onFileChange"
    >
      <document-upload-back
        :error="error"
        :is-loading="isLoading"
        :progress-value="$options.backSideController.progress"
        :progress-label="$options.backSideController.progressLabel"
        :file="selectedFile"
        @file-remove="onFileRemove"
      />
    </drop-area>
    <component
      :is="currentButtons"
      :is-loading="isLoading"
      :is-upload-ready="isUploadReady"
      @cancel="onClose"
      @done="onRecognize"
      @upload="onUploadFile"
      @repeat="onRecognize"
    />
  </div>
</template>

<script>
import VFileDropArea from '@endpass/ui/kit/VFileDropArea';
import FormItem from '@/components/common/FormItem';
import createBackSideController from './BackSideController';
import DocumentUploadDescription from '../DocumentUploadDescription';
import DocumentUploadBack from '@/components/forms/DocumentUploadForm/DocumentUploadBack';
import FooterRepeatButtons from '../FooterButtons/FooterRepeatButtons';
import FooterDoneButtons from '../FooterButtons/FooterDoneButtons';
import DropArea from '../DropArea';

export default {
  name: 'BackSide',

  inject: ['$validator'],

  backSideController: createBackSideController(),

  props: {
    documentId: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    error: null,
    selectedFile: null,
    isRecognitionError: false,
    isLoading: false,
    isUploaded: false,
  }),

  computed: {
    isUploadReady() {
      return !this.isLoading && !!this.selectedFile && !this.error;
    },

    currentButtons() {
      if (this.isRecognitionError) {
        return FooterRepeatButtons;
      }
      return FooterDoneButtons;
    },
  },

  methods: {
    onFileRemove() {
      this.error = '';
      this.selectedFile = null;
      this.isRecognitionError = false;
    },

    onFileChange(files) {
      const [file] = files;
      this.selectedFile = file;
    },

    onClose() {
      this.$emit('cancel');
    },

    async onRecognize() {
      try {
        this.isLoading = true;
        this.isRecognitionError = false;
        const status = await this.$options.backSideController.recognize(
          this.documentId,
        );
        this.handleConfirm(status);
      } catch (e) {
        this.isRecognitionError = true;
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },

    async startUpload() {
      try {
        this.isLoading = true;

        await this.$options.backSideController.startUpload({
          file: this.selectedFile,
          docId: this.documentId,
        });

        await this.$options.backSideController.sendUserMetrics();

        this.isUploaded = true;
      } catch (e) {
        this.isUploaded = false;
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },

    async continueUpload() {
      try {
        this.isLoading = true;
        this.isRecognitionError = false;
        const status = await this.$options.backSideController.continueUpload(
          this.documentId,
        );
        this.handleConfirm(status);
      } catch (e) {
        this.isRecognitionError = true;
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },

    handleConfirm(status) {
      this.$emit('confirm', {
        documentId: this.documentId,
        status,
      });
    },

    async onUploadFile() {
      await this.startUpload();
      if (!this.isUploaded) {
        return;
      }
      await this.continueUpload();
    },
  },

  components: {
    DropArea,
    DocumentUploadBack,
    DocumentUploadDescription,
    FormItem,
    VFileDropArea,
  },
};
</script>
