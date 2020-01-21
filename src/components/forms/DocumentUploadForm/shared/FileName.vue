<template>
  <div class="document-upload-file-name">
    {{ name }}
    <v-svg-icon
      name="close"
      height="8px"
      width="8px"
      @click.prevent="onRemove"
    />
  </div>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';

export default {
  name: 'FileName',

  props: {
    name: {
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
.document-upload-file-name {
  margin: 6px 0;
  font-weight: bold;
}
</style>
