<template>
  <div @click.prevent="onRemove">
    <upload-title
      :title="$t('global.error')"
      :is-error="!!error"
    />
    <file-name
      v-if="file"
      :name="file.name"
    />
    <v-description
      disabled
      :description="error"
    />
  </div>
</template>

<script>
import VDescription from '@endpass/ui/kit/VDescription';
import UploadTitle from './shared/UploadTitle';
import FileName from './shared/FileName';

export default {
  name: 'UploadError',

  props: {
    file: {
      type: File,
      default: null,
    },

    error: {
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
    FileName,
    UploadTitle,
    VDescription,
  },
};
</script>
