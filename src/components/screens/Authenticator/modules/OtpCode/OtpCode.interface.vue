<template>
  <otp-code
    v-bind="$attrs"
    @auth="onAuth"
    @recover="onRecover"
  />
</template>

<script>
import OtpCode from './OtpCode.interactor';

export default {
  name: 'OtpCodeInterface',

  methods: {
    onAuth() {
      this.$emit('complete');
    },

    onRecover() {
      this.$emit('switch', { to: 'otp-recovery' });
    },
  },

  components: {
    OtpCode,
  },
};
</script>
