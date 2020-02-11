<template>
  <app-code
    v-bind="$attrs"
    @auth="onAuth"
    @recover="onRecover"
  />
</template>

<script>
import AppCode from './AppCode.interactor';

export default {
  name: 'AppCodeInterface',

  methods: {
    onAuth() {
      this.$emit('complete');
    },

    onRecover() {
      this.$emit('switch', { to: 'otp-recovery' });
    },
  },

  components: {
    AppCode,
  },
};
</script>
