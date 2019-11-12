<template>
  <form-item>
    <v-file-drop-area
      v-validate="
        `ext:${$options.VALIDATE_ACCEPT}|size:${$options.MAX_FILE_SIZE}`
      "
      required
      :accept="$options.ACCEPT"
      :label="$t('components.uploadDocument.selectFile')"
      :disabled="isLoading"
      data-vv-as="File"
      data-vv-name="file"
      @change="onFileChange"
    >
      <slot />
    </v-file-drop-area>
    <document-upload-description />
  </form-item>
</template>

<script>
import VFileDropArea from '@endpass/ui/kit/VFileDropArea';
import FormItem from '@/components/common/FormItem';
import { ACCEPT, VALIDATE_ACCEPT, MAX_FILE_SIZE } from './sidesConstants';
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
  },

  ACCEPT,
  VALIDATE_ACCEPT,
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
