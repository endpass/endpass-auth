<template>
  <v-base-form>
    <v-base-form-field>
      <v-select
        :value="documentType"
        :options="$options.documentTypes"
        :label="$t('components.uploadDocument.documentType')"
        :disabled="!isDocTypeSelectable"
        @input="onChangeDocumentType"
      />
    </v-base-form-field>
    <v-base-form-field>
      <document-upload-area
        :file="file"
        :label="$t('components.uploadDocument.selectFile')"
        :error="error"
        :message-add="messageAdd"
        :message-ready="messageReady"
        :is-loading="isLoading"
        @change="onChangeFile"
      >
        <document-upload-progress
          slot="upload-progress"
          :progress="progressValue"
          :label="progressLabel"
        />
      </document-upload-area>
      <document-upload-description />
    </v-base-form-field>
  </v-base-form>
</template>

<script>
import VSelect from '@endpass/ui/kit/VSelect';
import VBaseForm from '@/components/common/VBaseForm';
import VBaseFormField from '@/components/common/VBaseFormField';
import { DOC_TYPES } from '@/constants';
import { CONSTANT_TRANSLATES } from '@/constants/translates';
import DocumentUploadArea from './DocumentUploadArea/DocumentUploadArea';
import DocumentUploadProgress from './DocumentUploadProgress';
import DocumentUploadDescription from './DocumentUploadDescription';

export default {
  name: 'DocumentUploadForm',
  props: {
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
    file: {
      type: File,
      default: null,
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
    DocumentUploadDescription,
    DocumentUploadProgress,
    VSelect,
    VBaseForm,
    VBaseFormField,
    DocumentUploadArea,
  },
};
</script>
