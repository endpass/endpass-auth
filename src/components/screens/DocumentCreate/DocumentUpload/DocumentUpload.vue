<template>
  <v-modal-card
    data-test="document-create-modal"
    :is-closable="false"
  >
    <template slot="title">
      {{ $t('components.uploadDocument.uploadDocument') }}
    </template>
    <form-item>
      <v-select
        :value="documentType"
        :options="$options.documentTypes"
        :label="$t('components.uploadDocument.documentType')"
        :disabled="!isFrontSide"
        @input="onChangeDocType"
      />
    </form-item>
    <form-item>
      <v-file-drop-area
        v-if="true"
        v-validate="`ext:${$options.VALIDATE_ACCEPT}`"
        required
        :accept="$options.ACCEPT"
        :label="$t('components.uploadDocument.selectFile')"
        :disabled="isLoading"
        data-vv-as="File"
        data-vv-name="file"
        @change="onFileChange"
      >
        <document-upload-form
          :error="error || errors.first('file')"
          :is-front-side="isFrontSide"
          :is-loading="isLoading"
          :is-recognize="uploadController.isRecognize"
          :is-uploading="uploadController.isUploading"
          :progress-value="uploadController.progress"
          :file="selectedFile"
          @file-remove="onFileRemove"
        />
      </v-file-drop-area>
      <document-upload-description />
    </form-item>
    <doc-upload-buttons
      :is-loading="isLoading"
      :is-front-side="isFrontSide"
      :is-recognition-error="isRecognitionError"
      :is-upload-ready="isUploadReady"
      @cancel="onClose"
      @done="handleConfirm"
      @upload="onUploadFile"
    />
  </v-modal-card>
</template>

<script>
import VSelect from '@endpass/ui/kit/VSelect';
import VModalCard from '@endpass/ui/kit/VModalCard';
import VFileDropArea from '@endpass/ui/kit/VFileDropArea';
import createUploadController from './DocumentUploadController';
import DocumentUploadForm from '@/components/forms/DocumentUploadForm/DocumentUploadForm';
import FormItem from '@/components/common/FormItem';
import { DOC_TYPES, DOCUMENT_SIDES } from '@/constants';
import { CONSTANT_TRANSLATES } from '@/constants/translates';
import {
  ACCEPT,
  VALIDATE_ACCEPT,
  MAX_FILE_SIZE,
} from './DocumentUploadConstants';
import DocUploadButtons from '@/components/screens/DocumentCreate/DocumentUpload/DocUploadButtons';
import DocumentUploadDescription from '@/components/screens/DocumentCreate/DocumentUpload/DocumentUploadDescription';

export default {
  name: 'DocumentUpload',

  inject: ['$validator'],

  data: () => ({
    uploadController: createUploadController(),
    error: null,
    documentType: DOC_TYPES.PASSPORT,
    selectedFile: null,
    documentId: null,
    currentSide: DOCUMENT_SIDES.FRONT,
    isRecognitionError: false,
  }),

  ACCEPT,
  VALIDATE_ACCEPT,

  documentTypes: [
    {
      text: CONSTANT_TRANSLATES[DOC_TYPES.PASSPORT],
      val: DOC_TYPES.PASSPORT,
    },
    {
      text: CONSTANT_TRANSLATES[DOC_TYPES.DRIVER_LICENSE],
      val: DOC_TYPES.DRIVER_LICENSE,
    },
  ],

  computed: {
    isFrontSide() {
      const ret = this.currentSide === DOCUMENT_SIDES.FRONT;
      return ret;
    },
    progressLabel() {
      const { uploadController } = this;
      if (uploadController.isUploading) {
        return this.$t('components.uploadDocument.uploading');
      }
      if (uploadController.isRecognize) {
        return this.$t('components.uploadDocument.recognition');
      }
      return '';
    },
    isLoading() {
      const { uploadController } = this;
      return (
        uploadController.isUploading ||
        uploadController.isRecognize ||
        uploadController.isConfirmation
      );
    },
    isUploadReady() {
      return (
        !this.isLoading &&
        !!this.selectedFile &&
        !this.error &&
        this.errors.count() === 0
      );
    },
  },

  methods: {
    onChangeDocType(documentType) {
      this.error = null;
      this.documentType = documentType;
    },

    onFileRemove() {
      this.error = null;
      this.selectedFile = null;
    },

    onFileChange(files) {
      const [file] = files;
      this.error = null;
      this.selectedFile = file;
      if (file && file.size > MAX_FILE_SIZE) {
        this.error = this.$t('components.uploadDocument.errorSizeLimit');
      }
    },

    onClose() {
      this.$emit('cancel');
    },

    async handleConfirm() {
      try {
        await this.uploadController.confirmDocument(this.documentId);
        this.$emit('confirm', this.documentId);
      } catch (e) {
        this.isRecognitionError = true;
        this.error = e.message;
      }
    },

    async nextStep() {
      if (this.isFrontSide) {
        this.currentSide = DOCUMENT_SIDES.BACK;
        return;
      }

      await this.handleConfirm();
    },

    async onUploadFile() {
      try {
        this.documentId = await this.uploadController.uploadDocument({
          file: this.selectedFile,
          type: this.documentType,
          docSide: this.currentSide,
        });

        this.selectedFile = null;

        await this.nextStep();
      } catch (e) {
        this.error = e.message;
      }
    },
  },

  beforeCreate() {
    this.uploadController = createUploadController();
  },

  components: {
    DocumentUploadDescription,
    VSelect,
    DocUploadButtons,
    FormItem,
    DocumentUploadForm,
    VModalCard,
    VFileDropArea,
  },
};
</script>
