<template>
  <div>
    <v-progress-circle
      v-if="isLoading"
      :progress="25"
    />
    <component
      :is="currentComponent"
      v-else
      :title="$t('components.uploadDocument.frontIsSelected')"
      :image-content="imageContent"
      :file-name="fileName"
      @file-remove="onFileRemove"
    />
  </div>
</template>

<script>
import VProgressCircle from '@endpass/ui/kit/VProgressCircle';
import UploadTitle from '@/components/forms/DocumentUploadForm/shared/UploadTitle';
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

    currentComponent() {
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
    onFileRemove() {
      this.$emit('file-remove');
    },

    isImage(file) {
      if (!file) return false;
      return file.type.indexOf('image') === 0;
    },

    loadImageContent(file) {
      this.isLoading = true;
      this.isFileAsTitle = false;

      const reader = new FileReader();
      reader.addEventListener('error', () => {
        this.isLoading = false;
        this.isFileAsTitle = true;
      });

      reader.addEventListener('load', e => {
        this.imageContent = e.target.result;
        this.isLoading = false;
      });

      reader.readAsDataURL(file);
    },
  },

  components: {
    FileAsImage,
    FileAsTitle,
    UploadTitle,
    VProgressCircle,
  },
};
</script>
