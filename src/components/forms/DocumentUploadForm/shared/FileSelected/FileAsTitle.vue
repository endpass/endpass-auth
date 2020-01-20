<template>
  <div>
    <upload-title :title="title" />
    <div class="document-upload-file">
      {{ fileName }}
      <v-svg-icon
        name="close"
        height="8px"
        width="8px"
        @click.prevent="$emit('file-remove', $event)"
      />
    </div>
  </div>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import UploadTitle from '@/components/forms/DocumentUploadForm/shared/UploadTitle';

export default {
  name: 'FileSelected',

  props: {
    title: {
      type: String,
      default: '',
    },

    file: {
      type: File,
      default: null,
    },
  },

  computed: {
    fileName() {
      return this.file && this.file.name;
    },
  },

  components: {
    UploadTitle,
    VSvgIcon,
  },
};
</script>

<style scoped lang="postcss">
.document-upload-file {
  margin: 6px 0;
  font-weight: bold;
}
</style>
