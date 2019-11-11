<template>
  <v-button
    :is-loading="isLoading"
    :disabled="!isUploadReady"
    data-test="submit-button"
    @click="onUploadFile"
  >
    {{ $t('global.confirm') }}
  </v-button>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';

export default {
  name: 'ButtonUpload',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    isUploadReady: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onUploadFile() {
      this.$emit('upload');
    },
  },

  components: {
    VButton,
  },
};
</script>
