<template>
  <div>
    <upload-header :document-type="documentType" />
    <drop-area
      :is-loading="isLoading"
      :error.sync="error"
      @change="onFileChange"
    >
      <document-upload-front
        :error="error"
        :is-loading="isLoading"
        :progress-value="$options.frontSideController.progress"
        :progress-label="$options.frontSideController.progressLabel"
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
      @upload="onUploadClick"
      @repeat="onRecognize"
    />
  </div>
</template>

<script>
import DocumentUploadFront from '@/components/forms/DocumentUploadForm/DocumentUploadFront';
import createFrontSideController from './FrontSideOnlyController';
import FooterFrontButtons from '@/components/modules/document/common/Upload/common/FooterButtons/FooterFrontButtons';
import FooterRepeatButtons from '@/components/modules/document/common/Upload/common/FooterButtons/FooterRepeatButtons';
import DropArea from '@/components/modules/document/common/Upload/common/DropArea';
import UploadHeader from '@/components/modules/document/common/Upload/common/UploadHeader/UploadHeader.view';

export default {
  name: 'FrontSideOnly',

  frontSideController: createFrontSideController(),

  inject: ['$validator'],

  props: {
    documentType: {
      type: String,
      default: '',
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
    isUploadReady() {
      return !this.isLoading && !!this.selectedFile && !this.error;
    },
    currentButtons() {
      if (this.isRecognitionError) {
        return FooterRepeatButtons;
      }
      return FooterFrontButtons;
    },
  },

  watch: {
    documentType() {
      this.error = '';
    },
  },

  methods: {
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

    onClose() {
      this.$emit('cancel');
    },

    async onRecognize() {
      try {
        this.isLoading = true;
        this.isRecognitionError = false;
        const document = await this.$options.frontSideController.recognize(
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
        this.documentId = await this.$options.frontSideController.startCreateDocument(
          {
            file: this.selectedFile,
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
        const document = await this.$options.frontSideController.continueCreateDocument(
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

    async onUploadClick() {
      await this.startCreateDocument();
      if (!this.documentId) {
        return;
      }
      await this.continueCreateDocument();
    },
  },

  mounted() {
    this.$options.frontSideController.init();
  },

  components: {
    UploadHeader,
    DropArea,
    FooterFrontButtons,
    DocumentUploadFront,
  },
};
</script>
