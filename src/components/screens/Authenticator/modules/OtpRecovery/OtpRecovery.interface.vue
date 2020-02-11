<template>
  <otp-recovery
    v-bind="$attrs"
    @otp-recovered="onRecovered"
    @cancel="onCancel"
  />
</template>

<script>
import OtpRecovery from './OtpRecovery.interactor';

export default {
  name: 'OtpRecoveryInterface',

  methods: {
    onRecovered() {
      this.$emit('complete');
    },

    onCancel() {
      this.$emit('switch', { to: 'app-code' });
    },
  },

  components: {
    OtpRecovery,
  },
};
</script>
