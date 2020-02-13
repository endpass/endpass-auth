<template>
  <recovery-code
    :email="email"
    @otp-recovered="onRecovered"
    @cancel="onCancel"
  />
</template>

<script>
import RecoveryCode from '@/components/modules/RecoveryCode';

export default {
  name: 'RecoveryCodeInterface',

  props: {
    email: {
      type: String,
      default: '',
    },
  },

  methods: {
    onRecovered() {
      this.$emit('complete');
    },

    onCancel() {
      this.$emit('switch', { to: 'app-code' });
    },
  },

  components: {
    RecoveryCode,
  },
};
</script>
