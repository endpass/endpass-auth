<template>
  <div>
    <upload-title
      :title="$t('global.error')"
      :is-error="!!error"
    />
    <file-selected
      :file="file"
      v-on="$listeners"
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
import FileSelected from './shared/FileSelected';

export default {
  name: 'ErrorFile',

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

  components: {
    FileSelected,
    UploadTitle,
    VDescription,
  },
};
</script>
