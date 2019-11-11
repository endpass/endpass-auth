<template>
  <div>
    <form-item>
      <v-file-drop-area
        v-validate="`ext:${$options.VALIDATE_ACCEPT}`"
        required
        :accept="$options.ACCEPT"
        :label="$t('components.uploadDocument.selectFile')"
        :disabled="isLoading"
        data-vv-as="File"
        data-vv-name="file"
        @change="onFileChange"
      >
        <document-upload-front
          :error="error || errors.first('file')"
          :is-loading="isLoading"
          :progress-value="frontSideController.progress"
          :progress-label="frontSideController.progressLabel"
          :file="selectedFile"
          @file-remove="onFileRemove"
        />
      </v-file-drop-area>
      <document-upload-description />
    </form-item>
    <footer-front-buttons
      :is-loading="isLoading"
      :is-upload-ready="isUploadReady"
      @cancel="onClose"
      @upload="onUploadClick"
    />
  </div>
</template>

<script>
import VFileDropArea from '@endpass/ui/kit/VFileDropArea';
import DocumentUploadFront from '@/components/forms/DocumentUploadForm/DocumentUploadFront';
import FormItem from '@/components/common/FormItem';
import { ACCEPT, VALIDATE_ACCEPT, MAX_FILE_SIZE } from '../SidesConstants';
import createFrontSideController from './FrontSideController';
import DocumentUploadDescription from '../DocumentUploadDescription';
import FooterFrontButtons from '../FooterButtons/FooterFrontButtons';

export default {
  name: 'DocumentUpload',

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
    frontSideController: createFrontSideController(),
    error: null,
    selectedFile: null,
    isLoading: false,
  }),

  ACCEPT,
  VALIDATE_ACCEPT,

  computed: {
    isUploadReady() {
      return (
        !this.isLoading &&
        !!this.selectedFile &&
        !this.error &&
        this.errors.count() === 0
      );
    },
  },

  watch: {
    documentType() {
      this.dropError();
    },
  },

  methods: {
    dropError() {
      this.error = null;
      this.$validator.errors.remove('file');
    },

    onFileRemove() {
      this.dropError();
      this.selectedFile = null;
    },

    onFileChange(files) {
      const [file] = files;
      this.dropError();
      this.selectedFile = file;
      if (file && file.size > MAX_FILE_SIZE) {
        this.error = this.$t('components.uploadDocument.errorSizeLimit');
      }
    },

    onClose() {
      this.$emit('cancel');
    },

    async onUploadClick() {
      try {
        this.isLoading = true;
        const documentId = await this.frontSideController.createDocument({
          file: this.selectedFile,
          type: this.documentType,
        });
        this.$emit('update:documentId', documentId);
        this.$emit('toggle');
      } catch (e) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },
  },

  components: {
    FooterFrontButtons,
    DocumentUploadDescription,
    FormItem,
    DocumentUploadFront,
    VFileDropArea,
  },
};
</script>
