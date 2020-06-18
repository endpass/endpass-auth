<template>
  <form-item>
    <v-file-drop-area
      v-validate="`ext:${validateExtensions}|size:${$options.MAX_FILE_SIZE}`"
      required
      :accept="acceptMimeTypes"
      :label="$t('components.uploadDocument.selectFile')"
      :disabled="isLoading"
      data-vv-as="File"
      data-vv-name="file"
      @change="onFileChange"
    >
      <slot />
    </v-file-drop-area>
    <document-upload-description
      :supported-files="descriptionSupportedFiles"
      :file-size="descriptionFileSize"
    />
  </form-item>
</template>

<script>
import VFileDropArea from '@endpass/ui/kit/VFileDropArea';
import FormItem from '@/components/common/FormItem';
import {
  VALIDATE_DEFAULT_EXT,
  ACCEPT_DEFAULT_MIME_TYPES,
  MAX_FILE_SIZE,
} from '../upload.constants';
import DocumentUploadDescription from './DocumentUploadDescription';

export default {
  name: 'DropArea',

  inject: ['$validator'],

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: '',
    },

    descriptionSupportedFiles: {
      type: String,
      default: '',
    },

    descriptionFileSize: {
      type: String,
      default: '',
    },

    validateExtensions: {
      type: String,
      default: VALIDATE_DEFAULT_EXT,
    },

    acceptMimeTypes: {
      type: String,
      default: ACCEPT_DEFAULT_MIME_TYPES,
    },
  },

  MAX_FILE_SIZE,

  computed: {
    fileErrors() {
      return this.errors.first('file');
    },
  },

  watch: {
    fileErrors: {
      handler(value) {
        return this.$emit('update:error', value);
      },

      deep: true,
    },
    error: {
      handler(value) {
        if (!value) {
          this.errors.removeById('file');
        }
      },
    },
  },

  methods: {
    onFileChange(files) {
      this.$emit('change', files);
    },
  },

  components: {
    DocumentUploadDescription,
    FormItem,
    VFileDropArea,
  },
};
</script>
