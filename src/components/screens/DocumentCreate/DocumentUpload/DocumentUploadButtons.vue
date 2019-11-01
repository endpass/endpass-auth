<template>
  <form-controls>
    <v-button
      v-if="isCancel"
      skin="quaternary"
      :disabled="isLoading"
      data-test="cancel-button"
      @click="onCancel"
    >
      {{ $t('global.cancel') }}
    </v-button>
    <v-button
      v-else
      skin="quaternary"
      :disabled="isLoading"
      data-test="done-button"
      @click="onDone"
    >
      {{ $t('global.done') }}
    </v-button>

    <v-button
      v-if="!isRecognitionError"
      :is-loading="isLoading"
      :disabled="!isUploadReady"
      data-test="submit-button"
      @click="onUploadFile"
    >
      {{ $t('global.confirm') }}
    </v-button>
    <v-button
      v-else
      :is-loading="isLoading"
      :disabled="isLoading"
      data-test="repeat-recognize-button"
      @click="onDone"
    >
      {{ $t('global.confirm') }}
    </v-button>
  </form-controls>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import FormControls from '@/components/common/FormControls';

export default {
  name: 'DocumentUploadButtons',

  props: {
    isFrontSide: {
      type: Boolean,
      default: true,
    },
    isRecognitionError: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isUploadReady: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isCancel() {
      return this.isFrontSide || this.isRecognitionError;
    },
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },

    onUploadFile() {
      this.$emit('upload');
    },

    onDone() {
      this.$emit('done');
    },
  },

  components: {
    FormControls,
    VButton,
  },
};
</script>
