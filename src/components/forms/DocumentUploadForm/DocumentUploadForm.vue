<template>
  <form>
    <form-item>
      <v-select
        :value="documentType"
        :options="$options.documentTypes"
        :label="$t('components.uploadDocument.documentType')"
        :disabled="!isDocTypeSelectable"
        @input="onChangeDocumentType"
      />
    </form-item>
    <form-item>
      <document-upload-area
        :label="$t('components.uploadDocument.selectFile')"
        :error="error"
        :message-add="messageAdd"
        :message-ready="messageReady"
        :is-loading="isLoading"
        :accept="accept"
        :file="file"
        @change="onChangeFile"
      >
        <document-upload-progress
          slot="upload-progress"
          :progress="progressValue"
          :label="progressLabel"
        />
      </document-upload-area>
      <document-upload-description />
    </form-item>
  </form>
</template>

<script>
import VSelect from '@endpass/ui/kit/VSelect';
import { DOC_TYPES } from '@/constants';
import { CONSTANT_TRANSLATES } from '@/constants/translates';
import DocumentUploadArea from './DocumentUploadArea/DocumentUploadArea';
import DocumentUploadProgress from './DocumentUploadProgress';
import DocumentUploadDescription from './DocumentUploadDescription';
import FormItem from '@/components/common/FormItem';

export default {
  name: 'DocumentUploadForm',

  props: {
    file: {
      type: File,
      default: null,
    },
    accept: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    messageAdd: {
      type: String,
      default: '',
    },
    messageReady: {
      type: String,
      default: '',
    },
    documentType: {
      type: String,
      default: DOC_TYPES.PASSPORT,
    },
    isDocTypeSelectable: {
      type: Boolean,
      default: true,
    },
    progressValue: {
      type: Number,
      default: 0,
    },
    progressLabel: {
      type: String,
      default: '',
    },
  },
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

  methods: {
    onChangeDocumentType(documentType) {
      this.$emit('change-document-type', documentType);
    },
    onChangeFile(file) {
      this.$emit('change-file', file);
    },
  },
  components: {
    FormItem,
    DocumentUploadDescription,
    DocumentUploadProgress,
    VSelect,
    DocumentUploadArea,
  },
  model: {
    prop: 'file',
    event: 'change-file',
  },
};
</script>
