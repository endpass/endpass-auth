<template>
  <component
    :is="currentForm"
    v-bind="$props"
    v-on="$listeners"
  />
</template>

<script>
import ButtonConfirmUploadFront from './ButtonConfirmUploadFront';
import ButtonCancel from './ButtonCancel';

export default {
  name: 'LeftButton',

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
  },

  computed: {
    isCancel() {
      return this.isFrontSide || this.isRecognitionError;
    },
    currentForm() {
      if (this.isCancel) {
        return ButtonCancel;
      }
      return ButtonConfirmUploadFront;
    },
  },
};
</script>
