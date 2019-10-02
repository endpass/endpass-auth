<template>
  <component
    :is="currentForm"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import EmailCode from './EmailCode';
import OtpCode from './OtpCode';
import { authStore } from '@/store';

export default {
  name: 'Code',

  authStore,

  computed: {
    otpEmail() {
      return this.$options.authStore.otpEmail;
    },

    currentForm() {
      return this.otpEmail ? OtpCode : EmailCode;
    },
  },

  components: {
    EmailCode,
    OtpCode,
  },
};
</script>
