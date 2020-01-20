<template>
  <div>
    <spinner v-if="isLoading" />
    <component
      :is="current"
      v-else
      :title="$t('components.uploadDocument.frontIsSelected')"
      :image-content="imageContent"
      :file-name="fileName"
      @file-remove="$listeners['file-remove']"
    />
  </div>
</template>

<script>
import UploadTitle from '@/components/forms/DocumentUploadForm/shared/UploadTitle';
import Spinner from '@/components/common/Spinner';
import FileAsTitle from './FileAsTitle';
import FileAsImage from './FileAsImage';

export default {
  name: 'FileSelected',

  props: {
    file: {
      type: File,
      default: null,
    },
  },

  data() {
    return {
      isLoading: true,
      isFileAsTitle: true,
      imageContent: null,
      fileId: '',
    };
  },

  computed: {
    fileName() {
      return this.file && this.file.name;
    },

    current() {
      if (this.isLoading) {
        return null;
      }

      if (this.isFileAsTitle) {
        return FileAsTitle;
      }

      return FileAsImage;
    },
  },

  watch: {
    file: {
      handler(file) {
        if (!this.isImage(file)) {
          this.isLoading = false;
          this.isFileAsTitle = true;
          return;
        }

        this.loadImageContent(file);
      },
      immediate: true,
    },
  },

  methods: {
    isImage(file) {
      if (!file) return false;
      return file.type.indexOf('image') === 0;
    },

    loadImageContent(file) {
      this.isLoading = true;
      this.isFileAsTitle = false;

      this.fileId = `${file.name}-${file.size}`;

      const { fileId } = this;
      const reader = new FileReader();
      reader.addEventListener('error', () => {
        if (this.fileId !== fileId) {
          return;
        }
        this.isLoading = false;
        this.isFileAsTitle = true;
      });

      reader.addEventListener('load', e => {
        if (this.fileId !== fileId) {
          return;
        }
        this.imageContent = e.target.result;
        this.isLoading = false;
      });

      reader.readAsDataURL(file);
    },
  },

  components: {
    Spinner,
    FileAsImage,
    FileAsTitle,
    UploadTitle,
  },
};
</script>
