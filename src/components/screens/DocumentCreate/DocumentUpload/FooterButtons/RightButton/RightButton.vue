<template>
  <component
    :is="currentForm"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import ButtonRepeatRecognize from './ButtonRepeatRecognize';
import ButtonUpload from './ButtonUpload';

export default {
  name: 'RightButton',

  computed: {
    currentForm() {
      if (this.$attrs['is-recognition-error']) {
        return ButtonRepeatRecognize;
      }
      return ButtonUpload;
    },
  },
};
</script>
