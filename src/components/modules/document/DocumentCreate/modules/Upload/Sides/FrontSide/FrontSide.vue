<template>
  <div>
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
    <footer-front-buttons
      :is-loading="isLoading"
      :is-upload-ready="isUploadReady"
      @cancel="onClose"
      @upload="onUploadClick"
    />
  </div>
</template>

<script>
import DocumentUploadFront from '@/components/forms/DocumentUploadForm/DocumentUploadFront';
import createFrontSideController from './FrontSideController';
import FooterFrontButtons from '../FooterButtons/FooterFrontButtons';
import DropArea from '../DropArea';

export default {
  name: 'DocumentUpload',

  frontSideController: createFrontSideController(),

  inject: ['$validator'],

  props: {
    documentType: {
      type: String,
      default: '',
    },
    documentId: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    error: null,
    selectedFile: null,
    isLoading: false,
  }),

  computed: {
    isUploadReady() {
      return !this.isLoading && !!this.selectedFile && !this.error;
    },
  },

  watch: {
    documentType() {
      this.error = '';
    },
  },

  methods: {
    onFileRemove() {
      this.error = '';
      this.selectedFile = null;
    },

    onFileChange(files) {
      const [file] = files;
      this.selectedFile = file;
    },

    onClose() {
      this.$emit('cancel');
    },

    async onUploadClick() {
      try {
        this.isLoading = true;
        const documentId = await this.$options.frontSideController.createDocument(
          {
            file: this.selectedFile,
            type: this.documentType,
          },
        );
        this.$emit('update:documentId', documentId);
        this.$emit('toggle');
      } catch (e) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    this.$options.frontSideController.init();
  },

  components: {
    DropArea,
    FooterFrontButtons,
    DocumentUploadFront,
  },
};
</script>
