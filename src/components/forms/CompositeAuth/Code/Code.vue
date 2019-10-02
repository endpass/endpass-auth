<template>
  <component
    :is="currentForm"
    :email="email"
    :password="password"
    @submit="onSubmit"
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

    password: {
      type: String,
      required: true,
    },
  },

  authStore,

  computed: {
    currentForm() {
      return this.otpEmail ? OtpCode : EmailCode;
    },

    otpEmail() {
      return this.$options.authStore.otpEmail;
    },
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },

    onSubmit(code) {
      this.$emit('submit', code);
    },
  },

  components: {
    EmailCode,
    OtpCode,
  },
};
</script>
