<template>
  <component
    :is="currentForm"
    :error="error"
    :email="email"
    @submit="onCodeSubmit"
    @cancel="onCancel"
  />
</template>

<script>
import EmailCode from './EmailCode';
import OtpCode from './OtpCode';
import { authStore } from '@/store';

export default {
  name: 'Code',

  props: {
    email: {
      type: String,
      required: true,
    },

    error: {
      type: String,
      default: null,
    },
  },

  authStore,

  computed: {
    currentForm() {
      return OtpCode; // this.otpEmail ? OtpCode : EmailCode;
    },

    otpEmail() {
      return this.$options.authStore.otpEmail;
    },
  },

  methods: {
    onCodeSubmit(code) {
      this.$emit('submit', code);
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    EmailCode,
    OtpCode,
  },
};
</script>
