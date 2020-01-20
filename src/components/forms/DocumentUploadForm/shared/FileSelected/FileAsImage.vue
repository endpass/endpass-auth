<template>
  <div class="document-upload-preview">
    <img
      :src="imageContent"
      class="document-upload-preview-img"
      alt="fileName"
    >
    <div
      class="document-upload-preview-remove"
      @click.prevent="$emit('file-remove', $event)"
    >
      <v-svg-icon
        name="close"
        height="10px"
        width="10px"
      />
    </div>
  </div>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';

export default {
  name: 'FileAsImage',

  props: {
    imageContent: {
      type: String,
      default: '',
    },

    fileName: {
      type: String,
      default: '',
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
