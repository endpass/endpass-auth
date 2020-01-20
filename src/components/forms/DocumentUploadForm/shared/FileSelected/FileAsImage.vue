<template>
  <div>
    <div class="document-upload-preview">
      <img
        v-show="!isLoading"
        class="document-upload-preview-img"
        :src="previewData"
      >
      <div
        class="document-upload-preview-remove"
        @click.native.prevent="$emit('file-remove', $event)"
      >
        <v-svg-icon
          name="close"
          height="10px"
          width="10px"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';

export default {
  name: 'FilePreview',

  props: {
    file: {
      type: File,
      default: null,
    },
  },

  data() {
    return {
      isLoading: true,
      isError: false,
      previewData: null,
      fileId: '',
    };
  },

  watch: {
    file: {
      handler(file) {
        this.isLoading = true;
        this.isError = false;

        this.fileId = `${file.name}-${file.size}`;

        const { fileId } = this;
        const reader = new FileReader();
        reader.onerror = () => {
          if (this.fileId !== fileId) {
            return;
          }
          this.isLoading = false;
          this.isError = true;
        };

        reader.onload = e => {
          if (this.fileId !== fileId) {
            return;
          }
          this.previewData = e.target.result;
          this.isLoading = false;
        };

        reader.readAsDataURL(file);
      },
      immediate: true,
    },
  },

  components: {
    VSvgIcon,
  },
};
</script>

<style scoped lang="postcss">
.document-upload-preview {
  position: relative;
  max-width: 181px;
}
.document-upload-preview-img {
  max-height: 128px;
}
.document-upload-preview-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: var(--endpass-ui-color-white);
  background: var(--endpass-ui-color-error);
}
</style>
