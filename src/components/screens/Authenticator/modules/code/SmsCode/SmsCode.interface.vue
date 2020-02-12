<template>
  <sms-code
    v-bind="$attrs"
    @auth="onAuth"
    @recover="onRecover"
  />
</template>

<script>
import SmsCode from './SmsCode.interactor';

export default {
  name: 'SmsCodeInterface',

  methods: {
    onAuth() {
      this.$emit('complete');
    },

    onRecover() {
      this.$emit('switch', { to: 'otp-recovery' });
    },
  },

  components: {
    SmsCode,
  },
};
</script>
