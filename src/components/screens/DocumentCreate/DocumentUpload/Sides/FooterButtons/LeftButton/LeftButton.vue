<template>
  <component
    :is="currentForm"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import ButtonDone from './ButtonDone';
import ButtonCancel from './ButtonCancel';

export default {
  name: 'LeftButton',

  computed: {
    currentForm() {
      if (this.$attrs['is-recognition-error']) {
        return ButtonCancel;
      }
      return ButtonDone;
    },
  },
};
</script>
