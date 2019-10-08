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
import { authStore, accountsStore } from '@/store';

export default {
  name: 'CodeForm',

  authStore,
  accountsStore,

  computed: {
    isOtp() {
      return this.$options.accountsStore.settings.otpEnabled;
    },

    currentForm() {
      return this.isOtp ? OtpCode : EmailCode;
    },
  },

  components: {
    EmailCode,
    OtpCode,
  },
};
</script>
