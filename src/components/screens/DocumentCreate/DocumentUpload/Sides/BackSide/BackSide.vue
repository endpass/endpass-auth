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
        <document-upload-back
          :error="error || errors.first('file')"
          :is-loading="isLoading"
          :progress-value="backSideController.progress"
          :progress-label="backSideController.progressLabel"
          :file="selectedFile"
          @file-remove="onFileRemove"
        />
      </v-file-drop-area>
      <document-upload-description />
    </form-item>
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
import { ACCEPT, VALIDATE_ACCEPT, MAX_FILE_SIZE } from '../SidesConstants';
import createBackSideController from './BackSideController';
import DocumentUploadDescription from '../DocumentUploadDescription';
import DocumentUploadBack from '@/components/forms/DocumentUploadForm/DocumentUploadBack';
import FooterRepeatButtons from '../FooterButtons/FooterRepeatButtons';
import FooterDoneButtons from '../FooterButtons/FooterDoneButtons';

export default {
  name: 'DocumentUpload',

  inject: ['$validator'],

  props: {
    documentId: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    backSideController: createBackSideController(),
    error: null,
    selectedFile: null,
    isRecognitionError: false,
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

    currentButtons() {
      if (this.isRecognitionError) {
        return FooterRepeatButtons;
      }
      return FooterDoneButtons;
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

    async onRecognize() {
      try {
        this.isLoading = true;
        this.isRecognitionError = false;
        await this.backSideController.recognize(this.documentId);
        this.$emit('confirm', this.documentId);
      } catch (e) {
        this.isRecognitionError = true;
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },

    async onUploadFile() {
      try {
        this.isLoading = true;
        await this.backSideController.upload({
          file: this.selectedFile,
          docId: this.documentId,
        });
        this.$emit('confirm', this.documentId);
      } catch (e) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },
  },

  components: {
    DocumentUploadBack,
    DocumentUploadDescription,
    FormItem,
    VFileDropArea,
  },
};
</script>
