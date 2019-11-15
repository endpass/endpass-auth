<template>
  <div>
    <div class="document-upload-file">
      {{ fileName }}
      <v-svg-icon
        name="close"
        height="8px"
        width="8px"
        @click.native.prevent="$emit('file-remove', $event)"
      />
    </div>
  </div>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';

export default {
  name: 'FileSelected',

  props: {
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
