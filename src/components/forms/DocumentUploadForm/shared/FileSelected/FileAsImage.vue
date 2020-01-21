<template>
  <div class="document-upload-file-image">
    <img
      :src="imageContent"
      class="document-upload-file-image-img"
      alt="fileName"
    >
    <div
      class="document-upload-file-image-remove"
      @click.prevent="onRemove"
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

  methods: {
    onRemove(ev) {
      this.$emit('file-remove', ev);
    },
  },

  components: {
    VSvgIcon,
  },
};
</script>

<style scoped lang="postcss">
.document-upload-file-image {
  position: relative;
  max-width: 181px;
}
.document-upload-file-image-img {
  max-height: 128px;
  max-width: 100%;
}
.document-upload-file-image-remove {
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
  background-color: var(--endpass-ui-color-error);
}
</style>
