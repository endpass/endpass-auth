<template>
  <v-button
    skin="quaternary"
    :disabled="isLoading"
    data-test="confirm-upload-front-button"
    @click="onDone"
  >
    {{ $t('global.done') }}
  </v-button>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';

export default {
  name: 'ButtonConfirmUploadFront',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onDone() {
      this.$emit('done');
    },
  },

  components: {
    VButton,
  },
};
</script>
