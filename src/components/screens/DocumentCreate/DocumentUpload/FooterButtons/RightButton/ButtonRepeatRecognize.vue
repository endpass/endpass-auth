<template>
  <v-button
    :is-loading="isLoading"
    :disabled="isLoading"
    data-test="repeat-recognize-button"
    @click="onRepeat"
  >
    {{ $t('global.confirm') }}
  </v-button>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';

export default {
  name: 'ButtonRepeatRecognize',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onRepeat() {
      this.$emit('repeat');
    },
  },

  components: {
    VButton,
  },
};
</script>
