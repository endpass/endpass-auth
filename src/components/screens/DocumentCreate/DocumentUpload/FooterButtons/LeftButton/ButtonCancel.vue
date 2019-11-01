<template>
  <v-button
    skin="quaternary"
    :disabled="isLoading"
    data-test="cancel-button"
    @click="onCancel"
  >
    {{ $t('global.cancel') }}
  </v-button>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';

export default {
  name: 'ButtonCancel',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    VButton,
  },
};
</script>
