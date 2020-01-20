<template>
  <div class="document-upload-file-name">
    {{ fileName }}
    <v-svg-icon
      name="close"
      height="8px"
      width="8px"
      @click.prevent="$emit('file-remove', $event)"
    />
  </div>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';

export default {
  name: 'FileName',

  props: {
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
.document-upload-file-name {
  margin: 6px 0;
  font-weight: bold;
}
</style>
