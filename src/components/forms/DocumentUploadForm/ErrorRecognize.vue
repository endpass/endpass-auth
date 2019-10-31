<template>
  <div>
    <upload-title
      :title="$t('global.error')"
      :is-error="!!error"
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

export default {
  name: 'ErrorRecognize',

  props: {
    error: {
      type: String,
      default: '',
    },
  },

  components: {
    UploadTitle,
    VDescription,
  },
};
</script>
