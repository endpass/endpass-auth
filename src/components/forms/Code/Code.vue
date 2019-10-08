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

  props: {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    isSignUp: {
      type: Boolean,
      required: true,
    },

    controller: {
      type: Object,
      required: true,
    },

    isClosable: {
      type: Boolean,
    },
  },

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
